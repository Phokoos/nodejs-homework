import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { ctrlWrapper } from '../decorators/index.js'

const signUp = async (req, res) => {
	const newUser = await User.create(req.body);
	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
}
export default {
	signUp: ctrlWrapper(signUp),
}