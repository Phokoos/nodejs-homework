import express from "express";
import { validateBody } from "../../decorators/index.js";
import userSighUpSchema from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSighUpSchema), authController.signUp)

export default authRouter; 