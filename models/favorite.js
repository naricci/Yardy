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
	dateAdded: {
		type: Date,
		default: Date.now
	}
});

// Compound Index
FavoriteSchema.index({ user: 1, yardsale: 1 });

const Favorite = mongoose.model('favorites', FavoriteSchema);

module.exports = Favorite;
