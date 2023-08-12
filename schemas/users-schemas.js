import Joi from "joi";
import joiCheckPasswordError from "../helpers/joiPasswordError.js";

const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const userSighUpSchema = Joi.object({
	password: Joi.string().regex(passwordPattern).required().error(joiCheckPasswordError),
	email: Joi.string().email().required(),
	subscription: Joi.string(),
	token: Joi.string(),
})

const userEmailVerify = Joi.object({
	email: Joi.string().email().required(),
})

const userSighInSchema = Joi.object({
	password: Joi.string().regex(passwordPattern).required().error(joiCheckPasswordError),
	email: Joi.string().email().required()
})

const userSetSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid('starter', 'pro', 'business'),
})

export default { userSighUpSchema, userSighInSchema, userSetSubscriptionSchema, userEmailVerify }