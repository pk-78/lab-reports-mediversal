import bcrypt from "bcryptjs";
import AdminUser from "../models/admin.model.js";
import jwt from "jsonwebtoken";


// Create new Admin User
export const createAdminUser = async (req, res) => {
  const { name, userId, password, role } = req.body;

  try {
    // Check if user already exists
    let existingUser = await AdminUser.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdminUser = new AdminUser({
      name,
      userId,
      password: hashedPassword,
      role,
    });

    await newAdminUser.save();

    res.status(201).json({
      message: "Admin user created successfully",
      adminUser: newAdminUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin user", error: error.message });
  }
};

// Get all Admin Users
export const getAllAdminUsers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find();
    res.status(200).json(adminUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin users", error: error.message });
  }
};

// Get a single Admin User by ID
export const getAdminUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.status(200).json(adminUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin user", error: error.message });
  }
};

export const loginAdminUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const adminUser = await AdminUser.findOne({ userId });
    if (!adminUser) {
      return res.status(404).json({ message: "User ID not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser.userId, role: adminUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    // Respond with the token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      adminUser: {
        name: adminUser.name,
        userId: adminUser.userId,
        role: adminUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
