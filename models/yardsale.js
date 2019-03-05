const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const yardsaleSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 25
	},
	lastname: {
		type: String,
		required: false,
		minlength: 1,
		maxlength: 25
	},
	phone: {
		type: Number,
		required: false
	},
	address: {
		type: String,
		required: false,
		maxlength: 250
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: false
	},
	zipcode: {
		type: String,
		required: false,
		minlength: 5,
		maxlength: 5
	},
	date: {
		type: String,
		required: false
	},
	starttime: {
		type: String,
		required: false
	},
	endtime: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: false,
		maxlength: 1000
	},
	imagename: {
		type: Array,
		required: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

var Yardsale = mongoose.model('yardsales', yardsaleSchema);

module.exports = Yardsale;
