const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema and Model
const FavoriteSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'users'
	},
	yardsale: {
		type: ObjectId,
		ref: 'yardsales',
	},
	isChecked: {
		type: Boolean,
		required: false
	},
	dateAdded: {
		type: Date,
		default: Date.now
	}
});

// Compound Index
// FavoriteSchema.index({ user: 1, yardsale: 1 });

const Favorite = mongoose.model('favorites', FavoriteSchema);

module.exports = Favorite;
