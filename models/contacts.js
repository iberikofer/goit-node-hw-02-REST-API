const express = require("express");
const fs = require('node:fs/promises')
const path = require("path");
const router = express.Router();
const crypto = require("crypto");
const jsonParcer = express.json();
const contactsPath = path.join(__dirname, "contacts.json");
const schema = path.join(__dirname, "../../models/contacts.js");

const getContacts = async (_, res, next) => {
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		return res.send(JSON.parse(data));
	} catch (error) {
		next(error);
	}
}

const getContactById = async (req, res, next) => {
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		const parsedContacts = JSON.parse(data)
		const [contact] = parsedContacts.filter(contact => contact.id === req.params.contactId)
		if (!contact) {
			return res.status(404).json({ message: "Contact is not found" });
		}
		return res.send(contact);
	} catch (error) {
		next(error)
	}
}

const addContact = async (req, res, next) => {
	// if (!req.body.name || !req.body.email || !req.body.number) {
	// 	return res.status(400).json({ message: "Missing required field!(name,email or number)" });
	// }
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		const parsedContacts = JSON.parse(data)
		const newContact = {
			id: crypto.randomUUID(),
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
		}
		parsedContacts.push(newContact);
		await fs.writeFile(contactsPath, JSON.stringify(parsedContacts));
		return res.status(201).json(newContact);
	} catch (error) {
		next(error)
	}
}

const removeContact = async (req, res, next) => {
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		const parsedContacts = JSON.parse(data)
		const contactIndex = parsedContacts.findIndex(
			(contact) => contact.id === req.params.contactId
		);
		if (contactIndex === -1) {
			return res.status(404).json({ message: "Contact is not found" });
		}
		parsedContacts.splice(contactIndex, 1);
		await fs.writeFile(contactsPath, JSON.stringify(parsedContacts));
		return res.status(200).json({ message: "Contact is deleted" });
	} catch (error) {
		next(error)
	}
}


const updateContact = async (req, res, _) => {
	// if (!req.body) {
	// 	return res.status(400).json({ message: "Missing fields to update!" });
	// }
	try {
		const data = await fs.readFile(contactsPath, "utf8");
		const parsedContacts = JSON.parse(data)
		const contactToUpdateIndex = parsedContacts.findIndex(contact => contact.id === req.params.contactId);
		if (contactToUpdateIndex === -1) {
			return res.status(404).json({ message: "Contact is not found" });
		}

		const contactToUpdate = parsedContacts[contactToUpdateIndex];
		const updatedContact = {
			id: contactToUpdate.id,
			name: req.body.name ? req.body.name : contactToUpdate.name,
			email: req.body.email ? req.body.email : contactToUpdate.email,
			number: req.body.number ? req.body.number : contactToUpdate.number,
		}
		parsedContacts[contactToUpdateIndex] = updatedContact;

		await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 2));
		return res.status(200).json(updatedContact);
	} catch (error) {
		return res.status(404).json({ message: "Not found" });
	}
}

router.post("/", jsonParcer, async (req, res, next) => {
	const response = schema.validate(req.body);
	if (typeof response.error !== "undefined") {
		console.log(response.error);
		return res.status(400).send({ message: "missing required name field" });
	} else {
		const newContact = await addContact(req.body);
		res.status(201).send(newContact);
	}
});

router.put("/:contactId", jsonParcer, async (req, res, next) => {
	const contactId = req.params.contactId;

	const response = schema.validate(req.body);
	if (typeof response.error !== "undefined") {
		return res.status(400).json({ message: "missing fields" });
	} else {
		const newContact = await updateContact(contactId, req.body);
		res.status(200).send(newContact);
	}
});

module.exports = {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
}
