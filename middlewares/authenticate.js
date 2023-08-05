import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../decorators/index.js";

import "dotenv/config"
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET

const authenticate = async (req, res, next) => {
	const { authorization = "" } = req.headers;
	const [bearer, token] = authorization.split(" ")

	if (bearer !== "Bearer") {
		throw HttpError(401, "Not authorized")
	}

	try {
		const { id } = jwt.verify(token, JWT_SECRET)
		const user = await User.findById(id)
		if (!user) {
			throw HttpError(401, "Not authorized")
		}

		if (token === user.token) {
			req.user = user
			return next()
		}

		throw HttpError(401, "Not authorized")
	} catch (error) {
		throw HttpError(401, "Not authorized")
	}

}

export default ctrlWrapper(authenticate)