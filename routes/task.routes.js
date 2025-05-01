import express from "express";

import {
  getAllTasksByUserId,
  createTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.controllers.js";

import { verifyRole, verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, verifyRole(["manager", "admin"]), createTask);

router
  .route("/:id")
  .get(verifyUser, getAllTasksByUserId)
  .put(verifyUser, updateTaskById)
  .delete(verifyUser, verifyRole(["manager", "admin"]), deleteTaskById);

export default router;
