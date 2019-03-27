const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const FavoriteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	// yardsale: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Yardsales',
	// },
	isChecked: {
		type: Boolean,
		required: false
	}
});

const Favorite = mongoose.model('Favorites', FavoriteSchema);

module.exports = Favorite;
