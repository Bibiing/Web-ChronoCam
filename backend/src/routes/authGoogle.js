import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://chronocam-web-backend.vercel.app/auth/google/callback"
          : "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First, check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        // If no user found by googleId, check by email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          // If user exists by email but no googleId
          if (user) {
            // Update the existing user with googleId
            user.googleId = profile.id;
            user.isVerified = true; // Ensure user is verified
            await user.save();
          } else {
            // Generate username from email
            const emailUsername = profile.emails[0].value.split("@")[0];

            // Check if username already exists, if so, append a number
            let username = emailUsername;
            let counter = 1;
            while (await User.findOne({ username })) {
              username = `${emailUsername}${counter}`;
              counter++;
            }

            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true,
              username: username,
            });
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and Deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes for authentication
const setupAuthRoutes = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }) // Add 'email' scope to access user's email
  );

  // Google callback route
  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", async (err, user) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.redirect(
          "https://chronocam-web.vercel.app/signin?error=auth_failed"
        );
      }

      if (!user) {
        console.error("No user returned from Google");
        return res.redirect(
          "https://chronocam-web.vercel.app/signin?error=no_user"
        );
      }

      try {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Build the redirect URL with properly encoded parameters
        const redirectUrl = new URL(
          "https://chronocam-web.vercel.app/login-success"
        );
        redirectUrl.searchParams.append("token", token);
        redirectUrl.searchParams.append("userId", user._id.toString());

        return res.redirect(redirectUrl.toString());
      } catch (error) {
        console.error("Token generation error:", error);
        return res.redirect(
          "https://chronocam-web.vercel.app/signin?error=token_generation_failed"
        );
      }
    })(req, res, next);
  });

  // Logout route
  app.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.next(err);
      }
      res.redirect("/");
    });
  });
};

export default setupAuthRoutes;
