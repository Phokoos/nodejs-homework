import Joi from "joi";

const userSighUpSchema = Joi.object({
	password: Joi.string().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$')).required(),
	email: Joi.string().email().required(),
	subscription: Joi.string(),
	token: Joi.string(),
})

const userSighInSchema = Joi.object({
	password: Joi.string().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$')).required(),
	email: Joi.string().email().required()
})

export default { userSighUpSchema, userSighInSchema }