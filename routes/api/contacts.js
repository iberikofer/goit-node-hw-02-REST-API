const express = require('express')
const path = require("path");
const router = express.Router()
const contactsPath = path.join(__dirname, "../../models/contacts.js");
const {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require(contactsPath)


router.get('/', getContacts)

router.get('/:contactId', getContactById)

router.post('/', addContact)

router.delete('/:contactId', removeContact)

router.put('/:contactId', updateContact)


module.exports = router
