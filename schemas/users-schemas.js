import Joi from "joi";

const userSighUpSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
	subscription: Joi.string(),
	token: Joi.string(),
})

export default userSighUpSchema