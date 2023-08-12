import { Schema, model } from 'mongoose'
import { handleSaveError, handleUpdateValidate } from './hooks.js'

const userSchema = new Schema({
	password: {
		type: String,
		required: [true, 'Set password for user'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter"
	},
	verify: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
		required: [true, 'Verify token is required'],
	},
	avatarURL: String,
	token: String
}, { versionKey: false, timestamps: true })

userSchema.pre("findOneAndUpdate", handleUpdateValidate)
userSchema.post("save", handleSaveError)
userSchema.post("findOneAndUpdate", handleSaveError)

const User = model("user", userSchema)

export default User