import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Ambil token dari header Authorization

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user di request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid." });
  }
};

export default authenticateToken;
