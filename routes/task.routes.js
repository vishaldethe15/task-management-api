import express from "express";

import {
  getAllTasksByAssignedTo,
  createTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.controllers.js";

import { verifyRole, verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(verifyUser, getAllTasksByAssignedTo)
  .post(verifyUser, verifyRole(["manager", "admin"]), createTask);

router
  .route("/:id")
  .patch(verifyUser, updateTaskById)
  .delete(verifyUser, verifyRole(["manager", "admin"]), deleteTaskById);

export default router;
