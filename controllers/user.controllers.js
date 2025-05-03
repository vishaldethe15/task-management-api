import UserModel from "../models/User.model.js";

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
export const updateUserById = async (req, res) => {};
export const deleteUserById = async (req, res) => {};
