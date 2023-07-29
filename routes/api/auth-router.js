import express from "express";
import { validateBody } from "../../decorators/index.js";
import authSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(authSchemas.userSighUpSchema), authController.signUp)
authRouter.post("/signin", validateBody(authSchemas.userSighInSchema), authController.signIn)

export default authRouter; 