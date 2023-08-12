import express from "express";
import { validateBody } from "../../decorators/index.js";
import authSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchemas.userSighUpSchema), authController.signUp)

authRouter.get("/verify/:verificationToken", authController.verify)

authRouter.post("/verify", validateBody(authSchemas.userEmailVerify), authController.resendVerifyEmail)

authRouter.post("/login", validateBody(authSchemas.userSighInSchema), authController.signIn)

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post('/logout', authenticate, authController.logout)

authRouter.patch("/", authenticate, validateBody(authSchemas.userSetSubscriptionSchema), authController.updateSubscriptionController)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.uploadNewAvatar)

export default authRouter; 