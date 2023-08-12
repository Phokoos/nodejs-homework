import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contacts.js";
import { ctrlWrapper } from '../decorators/index.js'
import path from "path";

export const listContactsController = ctrlWrapper(async (req, res) => {
	const { page = 1, limit = 5, ...query } = req.query
	const skip = (page - 1) * limit
	const { _id: owner } = req.user;

	const list = await Contact.find({ owner, ...query }, null, { skip, limit });
	res.json(list)
})

export const getContactByIdController = ctrlWrapper(async (req, res) => {
	const contact = await Contact.findById(req.params.contactId)
	if (!contact) {
		throw HttpError(404, "Not found")
	}
	console.log(contact);
	res.json(contact)
})

const avatarPath = path.resolve("public", "avatars")

export const addContactController = ctrlWrapper(async (req, res) => {
	const { _id: owner } = req.user;
	const contact = await Contact.create({ ...req.body, owner });
	res.status(201).json(contact)
})

export const removeContactController = ctrlWrapper(async (req, res) => {
	const contact = await Contact.findByIdAndRemove(req.params.contactId);
	if (!contact) {
		throw HttpError(404, "Not found")
	}
	res.json({ "message": "contact deleted" })
})

export const updateContactController = ctrlWrapper(async (req, res) => {
	const contact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
	if (!contact) {
		throw HttpError(404, "Not found")
	}
	res.json(contact)
})

export const updateContactFavoriteController = ctrlWrapper(async (req, res) => {
	const contact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
	if (!contact) {
		throw HttpError(404, "Not found")
	}
	res.json(contact)
})

// Test

export const sum = (a, b) => {
	return a + b;
}