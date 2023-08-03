import bcrypt from "bcryptjs"
import "dotenv/config"
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { ctrlWrapper } from '../decorators/index.js'
import jwt from "jsonwebtoken";
import usersSchemas from "../schemas/users-schemas.js";

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
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		}
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

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" })
	const userWithToken = Object.assign(user, { token: token })

	const updatedUser = await User.findByIdAndUpdate(user._id, userWithToken, { new: true })

	res.json({
		token: updatedUser.token,
		user: {
			email: updatedUser.email,
			subscription: updatedUser.subscription
		}
	})
}

const getCurrent = (req, res) => {
	const { subscription, email } = req.user

	res.json({
		email,
		subscription
	}
	)
}

export default {
	signUp: ctrlWrapper(signUp),
	signIn: ctrlWrapper(signIn),
	getCurrent: ctrlWrapper(getCurrent)
}