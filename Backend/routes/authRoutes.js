const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerStudent,
  loginStudent,
  getMe
} = require("../controllers/authController");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/me", protect, getMe); // New profile route

module.exports = router;