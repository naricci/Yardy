const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema and Model
var favoriteSchema = new Schema({
	_userId: {
		type: ObjectId,
		ref: 'user'
	},
	_yardsaleId: {
		type: ObjectId,
		ref: 'yardsale'
	},
	isChecked: {
		type: Boolean,
		required: false
	}
});

var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
