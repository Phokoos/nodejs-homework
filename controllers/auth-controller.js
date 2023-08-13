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
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";
import usersSchemas from "../schemas/users-schemas.js";
const { JWT_SECRET, BASE_URL } = process.env

const signUp = async (req, res) => {
	const { email, password } = req.body;


	const user = await User.findOne({ email })

	if (user) {
		throw HttpError(409, "Email in use")
	}

	const hashPassword = await bcrypt.hash(password, 10)
	const verificationToken = nanoid()
	const avatarURL = gravatar.url(email, { s: '250' })

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_black" >Click verify</a>`
	}

	await sendEmail(verifyEmail);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		}
	});
}

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken })
	if (!user) {
		throw HttpError(404, "User not found")
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "verify" })

	res.json({
		message: "Verify success"
	})
}

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email })
	if (!user) {
		throw HttpError(404, "User not found")
	}
	if (user.verify) {
		throw HttpError(400, "Verification has already been passed")
	}

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}" target="_black" >Click verify</a>`
	}

	await sendEmail(verifyEmail);

	res.json({
		message: "Verification email sent"
	})
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

	if (!user.verify) {
		throw HttpError(401, "User`s email not verified")
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
	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	signIn: ctrlWrapper(signIn),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
	uploadNewAvatar: ctrlWrapper(uploadNewAvatar)
}