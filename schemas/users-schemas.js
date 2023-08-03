import Joi from "joi";
import joiCheckPasswordError from "../helpers/joiPasswordError.js";

const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const userSighUpSchema = Joi.object({
	password: Joi.string().regex(passwordPattern).required().error(joiCheckPasswordError),
	email: Joi.string().email().required(),
	subscription: Joi.string(),
	token: Joi.string(),
})

const userSighInSchema = Joi.object({
	password: Joi.string().regex(passwordPattern).required().error(joiCheckPasswordError),
	email: Joi.string().email().required()
})

export default { userSighUpSchema, userSighInSchema }