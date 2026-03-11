import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name,email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Enter a password with min. length 8" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertedUser = await User.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    generateToken({ id: insertedUser._id, isAdmin: insertedUser.isAdmin }, res);

    res.status(201).json({
      name: insertedUser.name,
      email: insertedUser.email,
      isAdmin: insertedUser.isAdmin,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email }).select("-createdAt -updatedAt");
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken({ id: user._id, isAdmin: user.isAdmin }, res);

    res.redirect("/shop.html");
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");

  res.status(200).json({ message: "Logged Out successfully" });
};
