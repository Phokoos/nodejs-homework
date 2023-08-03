import express from "express";
import { validateBody } from "../../decorators/index.js";
import authSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";
import authenticate from "../../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchemas.userSighUpSchema), authController.signUp)
authRouter.post("/login", validateBody(authSchemas.userSighInSchema), authController.signIn)
authRouter.get("/current", authenticate, authController.getCurrent)
// authRouter.patch("/users", authenticate, validateBody(authSchemas.userSetSubscriptionSchema))
authRouter.patch("/", authenticate, validateBody(authSchemas.userSetSubscriptionSchema), (res, req, next) => { console.log(res.body); })

export default authRouter; 