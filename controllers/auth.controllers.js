import UserModel from "../models/User.model.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { genToken } from "../lib/genToken.js";

export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, name, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await UserModel.create({ name, email, password, role });

    res.status(201).json({
      message: "User created successfully",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials !" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials !" });
    }

    const token = await genToken({ userId: user.id, role: user.role });

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        userId: user.id,
        name: user.name,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
