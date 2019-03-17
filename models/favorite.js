const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema and Model
var FavoriteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	// yardsale: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'yardsales',
	// },
	isChecked: {
		type: Boolean,
		required: false
	}
});

var Favorite = mongoose.model('favorites', FavoriteSchema);

module.exports = Favorite;
