import express from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { verifyRole, verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(verifyUser, verifyRole("admin"), register);
router.route("/login").post(login);

export default router;
