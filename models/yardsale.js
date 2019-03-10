var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var moment = require('moment');

// Create Schema and Model
var yardsaleSchema = new Schema({
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
	username: {
		type: Schema.ObjectId,
		ref: 'Author',
		required: true
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
		required: true,
		minlength: 5,
		maxlength: 5
	},
	date: {
		type: Date,
		required: true
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

// Virtual for this yardsale instance URL.
yardsaleSchema.virtual('url').get(function() {
	return '/yardsale/' + this._id;
});

var Yardsale = mongoose.model('yardsales', yardsaleSchema);

module.exports = Yardsale;
