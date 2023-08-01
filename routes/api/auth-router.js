import express from "express";
import { validateBody } from "../../decorators/index.js";
import authSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchemas.userSighUpSchema), authController.signUp)
authRouter.post("/login", validateBody(authSchemas.userSighInSchema), authController.signIn)

export default authRouter; 