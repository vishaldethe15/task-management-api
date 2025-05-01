import TaskModel from "../models/Task.model.js";
import { taskSchema } from "../validators/task.validator.js";
import { connectDB } from "../db/connect.js";

export const createTask = async (req, res) => {
  const { userId } = req.user;

  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, dueDate, priority, status, assignedTo } =
    req.body;

  try {
    await connectDB();

    const task = await TaskModel.create({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: userId,
      assignedTo,
    });

    res.status(201).json({
      taskId: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      createdBy: task.createdBy,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllTasksByUserId = async (req, res) => {};
export const updateTaskById = async (req, res) => {};
export const deleteTaskById = async (req, res) => {};
