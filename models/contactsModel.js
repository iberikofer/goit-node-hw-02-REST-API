const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Set name for your contact']
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: Number,
		required: true,
		unique: true
	},
	favorite: {
		type: Boolean,
		default: false,
	},

}, {
	versionKey: false,
	timestamps: true
})

const contactModel = mongoose.model("contact", contactSchema)

module.exports = contactModel