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
      taskId: task.id,
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

export const getAllTasksByAssignedTo = async (req, res) => {
  const { userId } = req.user;
  const {
    search,
    status,
    priority,
    dueBefore,
    dueAfter,
    overdue,
    limit = 20,
    page = 1,
  } = req.query;
  const skip = (parseInt(page) - 1) * limit;
  try {
    const filter = { assignedTo: userId };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (dueBefore || dueAfter) {
      filter.dueDate = {};
      if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
    }

    if (overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: "completed" };
    }

    const tasks = await TaskModel.find(filter)
      .select(
        "id title description status priority dueDate createdBy assignedTo createdAt "
      )
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1 });

    const total = await TaskModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      page: parseInt(page),
      totalPages: totalPages,
      totalTasks: total,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateTaskById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const updateData = req.body;

  try {
    const task = await TaskModel.findById(id).select(
      "id title description status priority dueDate createdBy updatedAt"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (role === "user") {
      if ("status" in updateData && Object.keys(updateData).length === 1) {
        task.status = updateData.status;
      } else {
        return res.status(403).json({
          message: "Users can only update the task status.",
        });
      }
    } else if (role === "manager") {
      if (task?.createdBy?.toString() !== userId?.toString()) {
        return res.status(403).json({
          message: "Managers can only update tasks they have created.",
        });
      }
      Object.assign(task, updateData);
    } else if (role === "admin") {
      Object.assign(task, updateData);
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTaskById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    await connectDB();

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (role === "manager") {
      if (task.createdBy.toString() === userId.toString()) {
        await TaskModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Task deleted by manager" });
      } else {
        return res.status(403).json({
          message: "You can only delete tasks you have created",
        });
      }
    }

    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted by admin" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
