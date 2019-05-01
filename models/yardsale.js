const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const YardsaleSchema = new Schema({
	phone: {
		type: Number,
		required: [true, 'Phone is required'],
		minlength: 10,
		maxlength: 10
	},
	address: {
		type: String,
		text: true,
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
		text: true,
		required: true,
		maxlength: 25
	},
	state: {
		type: String,
		text: true,
		required: [true, 'State is required'],
		index: true,
		maxlength: 2
	},
	zipcode: {
		type: String,
		text: true,
		required: [true, 'Zip Code is required'],
		minlength: 5,
		maxlength: 5
	},
	date: {
		type: Date,
		required: [true, 'Date is required']
	},
	starttime: {
		type: String,
		required: [true, 'Start Time is required']
	},
	endtime: {
		type: String,
		required: [true, 'End Time is required'],
	},
	description: {
		type: String,
		required: false,
		maxlength: 1000
	},
	imagename: {
		type: String,
		required: false,
		maxlength: 50
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

// TODO - Add column/function to generate date + time when document is updated

// Create Index
YardsaleSchema.index({ 'address':'text', 'city':'text', 'state': 'text', 'zipcode': 'text' });

// Virtual for this yardsale instance URL.
YardsaleSchema
	.virtual('url').get(function() {
		return '/yardsale/' + this._id;
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

const Yardsale = mongoose.model('yardsales', YardsaleSchema);

module.exports = Yardsale;
