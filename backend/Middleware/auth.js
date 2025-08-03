const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    // Handle admin tokens (admin tokens have id as 'admin-id')
    if (decoded.id === 'admin-id' && decoded.role === 'admin') {
      req.user = {
        _id: 'admin-id',
        name: 'Admin',
        email: decoded.email,
        role: 'admin'
      };
    } else {
      // Handle regular user tokens
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Invalid token. User not found" });
      }
      req.user = user;
    }
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ message: "Access denied. Admin privileges required" });
  }
  next();
};

module.exports = { auth, verifyAdmin };