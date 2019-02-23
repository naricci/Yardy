const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// Create Schema and Model
const userSchema = new Schema({
    // _userId: {
    //     type: Number,
    //     unique: true,
    //     required: [true, 'User ID is required']
    // },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: 1,
        maxlength: 25
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 1
    },
    isValidated: {
        type: Boolean,
        required: false
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: {unique: true, dropDups: true},
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 5
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

//userSchema.set('toJSON', { virtuals: true });

var User = mongoose.model('users', userSchema);

module.exports = User;