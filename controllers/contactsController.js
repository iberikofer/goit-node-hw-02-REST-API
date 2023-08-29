const ContactModel = require("../models/contactsModel")

async function getContacts(_, res, next) {
	try {
		const contacts = await ContactModel.find().exec()

		return res.send(contacts)
	} catch (error) {
		next(error);
	}
}

async function getContactById(req, res, next) {
	try {
		const contact = await ContactModel.findById(req.params.id).exec()

		if (contact === null) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(contact)
	} catch (error) {
		next(error)
	}
}

async function addContact(req, res, next) {
	try {
		const newContact = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
		}

		const contact = await ContactModel.create(newContact)

		res.status(201).send(contact)
	} catch (error) {
		next(error)
	}
}

async function removeContact(req, res, next) {
	try {
		const result = await ContactModel.findByIdAndRemove(req.params.id).exec()

		if (result === null) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(result)
	} catch (error) {
		next(error)
	}
}


async function updateContact(req, res, next) {
	try {
		const newContact = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
		}

		const result = await ContactModel.findByIdAndUpdate(req.params.id, newContact, { new: true }).exec()
		if (result === null) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(result)
	} catch (error) {
		next(error)
	}
}

async function updateContactField(req, res, next) {
	try {
		if (!Object.keys(req.body).includes('favorite')) {
			return res.status(400).send({ message: "Missing field - favorite!" });
		}
		const result = await ContactModel.findByIdAndUpdate(
			req.params.id,
			{ $set: { favorite: req.body.favorite } },
			{ new: true }
		).exec()

		return res.send(result)
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateContactField
}
