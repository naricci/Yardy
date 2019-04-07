const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const FavoriteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	yardsale: {
		type: Schema.Types.ObjectId,
		ref: 'yardsales',
	},
	isChecked: {
		type: Boolean,
		required: false
	}
});

const Favorite = mongoose.model('favorites', FavoriteSchema);

module.exports = Favorite;
