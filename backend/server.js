import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import setupAuthRoutes from "./src/routes/authGoogle.js";
import manualAuthRoutes from "./src/routes/authManual.js";
import userRoutes from "./src/routes/userRoutes.js";
import imageRoutes from "./src/routes/imageRoutes.js";
import upload from "./src/uploads/image.js";

dotenv.config();

// Koneksi ke MongoDB
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error:", error));

const app = express();

// Middleware CORS
app.use(
  cors({
    origin: [
      "https://chronocam-web.vercel.app/",
      "https://accounts.google.com",
      "https://backend-web-chrono-cam.vercel.app/auth/google/callback",
      "https://chrono-sand.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware untuk parsing JSON
app.use(express.json({ limit: "1gb" }));

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Setup auth routes
setupAuthRoutes(app);

// Rute manual auth
app.use("/auth", manualAuthRoutes);

// Rute untuk API pengguna
app.use("/api", userRoutes);

// Rute untuk upload gambar
app.use("/upload", upload);

app.use("/images", imageRoutes);

// app.use("/user", userRoutes);
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
