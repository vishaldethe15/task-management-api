import express from "express";

import {
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controllers.js";

import { verifyRole, verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(verifyUser, verifyRole(["manager", "admin"]), getAllUsers);

router
  .route("/:id")
  .patch(verifyUser, updateUserById)
  .delete(verifyUser, verifyRole(["admin"]), deleteUserById);

export default router;
