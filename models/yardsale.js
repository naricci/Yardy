const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const YardsaleSchema = new Schema({
	phone: {
		type: Number,
		required: false,
		minlength: 10,
		maxlength: 10
	},
	address: {
		type: String,
		required: false,
		maxlength: 250
	},
	address2: {
		type: String,
		required: false,
		maxlength: 250
	},
	city: {
		type: String,
		required: true,
		maxlength: 25
	},
	state: {
		type: String,
		required: true,
		maxlength: 2
	},
	zipcode: {
		type: String,
		required: false,
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
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

// Virtual for this yardsale instance URL.
YardsaleSchema
	.virtual('url').get(function() {
		return '/catalog/yardsale/' + this._id;
	});

// Full address
YardsaleSchema
	.virtual('full_address').get(function() {
		return this.address + ', ' + this.city + ', ' + this.state + ', ' + this.zipcode;
	});

// Date and Time
YardsaleSchema
	.virtual('date_and_time').get(function() {
		return this.date.toDateString() + ', ' + this.starttime + ' - ' + this.endtime;
	});

const Yardsale = mongoose.model('Yardsales', YardsaleSchema);

module.exports = Yardsale;
