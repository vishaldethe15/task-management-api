import UserModel from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const total = await UserModel.countDocuments();
    const totalPages = Math.ceil(total / limit) || 1;

    const users = await UserModel.find()
      .select("_id name email role")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      page,
      totalPages,
      totalUsers: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, role: userRole } = req.user;
  const { name, email, password, role } = req.body;

  try {
    if (userRole === "user" && userId !== id) {
      return res.status(403).json({
        message: "Users can only update their own profile",
      });
    }

    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (role) {
      if (userRole !== "admin") {
        return res.status(403).json({
          message: "Only admin can update user roles",
        });
      }
      updateFields.role = role;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("_id name email role");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
