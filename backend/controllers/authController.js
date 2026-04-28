const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

const createToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",
  secure: false,
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  birthday: user.birthday,
  location: user.location,
  gender: user.gender,
  avatar: user.avatar,
  profileSetupDone: user.profileSetupDone || false,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, profileSetupDone: false });
    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "Account created!", user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No account found with this email" });
    if (!user.password) return res.status(400).json({ message: "Please login with Google" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);
    res.json({ message: "Logged in!", user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
