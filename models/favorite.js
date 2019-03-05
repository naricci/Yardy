const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema and Model
var favoriteSchema = new Schema({
	_userId: {
		type: ObjectId //,
		// required: [true, 'User ID is required']
	},
	_yardsaleId: {
		type: ObjectId //,
		// required: true
	},
	isChecked: {
		type: Boolean,
		required: false
	}
});

var Favorite = mongoose.model('favorites', favoriteSchema);

module.exports = Favorite;
