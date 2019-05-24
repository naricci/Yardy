const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
	message: {
		text: {
			type: String,
			required: true
		}
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	dateSent: {
		type: Date,
		default: Date.now
	},
	dateRead: {
		type: Date,
	}
},
{
	timestamps: true
});

const Message = mongoose.model('messages', MessageSchema);

module.exports = Message;
