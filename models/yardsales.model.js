const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema and Model
var yardsaleSchema = new Schema({
    _yardsaleId: {
        type: ObjectId,
        unique: true
    },
    _userId: {
        type: ObjectId
    },
    date: {
        type: Date,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeEnd: {
        type: Date,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    imageName: {
        type: Array,
        required: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

var Yardsale = mongoose.model('yardsales', yardsaleSchema);

module.exports = Yardsale;