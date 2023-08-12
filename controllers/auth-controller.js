import bcrypt from "bcryptjs"
import "dotenv/config"
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { ctrlWrapper } from '../decorators/index.js'
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import fs from 'fs/promises'
import Jimp from "jimp";
import path from "path";
const JWT_SECRET = process.env.JWT_SECRET

const signUp = async (req, res) => {
	const { email, password } = req.body;


	const user = await User.findOne({ email })

	if (user) {
		throw HttpError(409, "Email in use")
	}

	const hashPassword = await bcrypt.hash(password, 10)
	const avatarURL = gravatar.url(email, { s: '250' })

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		}
	});
}

const uploadNewAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: oldPath } = req.file;

	const avatarPathNewForSave = `public/avatars/${_id}.png`
	const avatarPathForDB = path.join("avatars", `${_id}.png`)

	Jimp.read(oldPath, (err, avatar) => {
		if (err) throw err;
		avatar
			.resize(250, 250)
			.write(avatarPathNewForSave);
	});

	const userWithNewAvatar = await User.findByIdAndUpdate(_id, { avatarURL: avatarPathForDB }, { new: true })

	await fs.unlink(oldPath);

	res.json({
		avatarURL: userWithNewAvatar.avatarURL
	})
}

const signIn = async (req, res) => {
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

	const updatedUser = await User.findByIdAndUpdate(user._id, { token }, { new: true })

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

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" }),

		res.status(204).send()
}

const updateSubscriptionController = async (req, res) => {
	const { _id } = req.user;
	const { subscription } = req.body
	const updatedUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true })

	res.json({
		email: updatedUser.email,
		subscription: updatedUser.subscription
	})
}
export default {
	signUp: ctrlWrapper(signUp),
	signIn: ctrlWrapper(signIn),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
	uploadNewAvatar: ctrlWrapper(uploadNewAvatar)
}