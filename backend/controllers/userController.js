import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const registerUser = async (req, res) => {
  const { username, name, email, password, age, phone, role } = req.body;
  const profileImage = req.file ? req.file.path : null;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      age,
      role,
      phone,
      profileImage,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export { upload };


export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    req.session.user = { id: user._id, username: user.username, role: user.role };

    res.json({ message: "Login successful!", user: req.session.user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getSessionUser = async (req, res) => {
  if (req.session.user) {
    try {
      const user = await User.findOne({ username: req.session.user.username }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const role = await Role.findOne({ role: user.role });
      const permissions = role ? role.permissions : [];

      res.json({ user: { 
        _id: user._id, 
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        age: user.age,
        profileImage: user.profileImage,
        permissions: permissions,
      }});
    } catch (error) {
      console.error("Error fetching session user:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  } else {
    res.status(200).json({ user: null });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed!" });
    }

    res.clearCookie("connect.sid", { path: "/" }); 
    res.json({ message: "Logged out successfully" });
  });
};

export const updateUser = async (req, res) => {
  const { name, age, phone, role } = req.body;
  let newProfileImage = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (newProfileImage && user.profileImage) {
      const oldImagePath = path.join("uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.name = name || user.name;
    user.age = age || user.age;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    if (newProfileImage) {
      user.profileImage = newProfileImage;
    }

    await user.save();
    res.json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.profileImage) {
      const imagePath = path.join(process.cwd(), user.profileImage);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting profile image:", err);
      });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};