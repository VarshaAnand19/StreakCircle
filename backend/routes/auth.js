const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        location: user.location,
        gender: user.gender,
        avatar: user.avatar,
        profileSetupDone: user.profileSetupDone,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here") {
  const passport = require("passport");
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => res.redirect("http://localhost:5173")
  );
}

module.exports = router;