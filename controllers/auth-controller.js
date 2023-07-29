import bcrypt from "bcryptjs"
import "dotenv/config"

import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { ctrlWrapper } from '../decorators/index.js'
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET

const signUp = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email })
	if (user) {
		throw HttpError(409, "Email in use")
	}

	const hashPassword = await bcrypt.hash(password, 10)

	const newUser = await User.create({ ...req.body, password: hashPassword });
	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
}

const signIn = async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email })
	if (!user) {
		throw HttpError(401, "Email or password is wrong")
	}

	const passwordCompare = await bcrypt.compare(password, user.password)

	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong")
	}

	const payload = {
		id: user._id
	}

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })

	res.json({
		token,
	})
}

export default {
	signUp: ctrlWrapper(signUp),
	signIn: ctrlWrapper(signIn),
}