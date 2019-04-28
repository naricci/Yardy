#! /usr/bin/env node

console.log('This script populates some users & yard sales into the database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return;
}

var async = require('async');
var User = require('./models/user');
var Yardsale = require('./models/yardsale');
// var Favorite = require('./models/favorite');

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var yardsales = [];
// var favorites = [];

function userCreate(username, email, firstName, lastName, phone, address, 
                    address2, city, state, zipcode, cb) {
  var userDetail = {
    username: username , 
    email: email, 
    firstName: firstName, 
    lastName: lastName, 
    phone: phone, 
    address: address, 
    address2: address2, 
    city: city, 
    state: state, 
    zipcode: zipcode
  };
  if (firstName !== false) userDetail.firstName = firstName;
  if (lastName !== false) userDetail.lastName = lastName;
  if (address !== false) userDetail.address = address;
  if (address2 !== false) userDetail.address2 = address2;
  if (city !== false) userDetail.city = city;
  if (state !== false) userDetail.state = state;
  if (zipcode !== false) userDetail.zipcode = zipcode;
  
  var user = new User(userDetail);
       
  user.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  }  );
}

function yardsaleCreate(phone, address, address2, city, state, zipcode, date, 
                        starttime, endtime, description, user, cb) {
  yardsaleDetail = { 
    phone: phone,
    address: address,
    address2: address2,
    city: city,
    state: state,
    zipcode: zipcode,
    date: date,
    starttime: starttime,
    endtime: endtime,
    description: description,
    user: user
  }
  if (user != false) yardsaleDetail.user = user;
    
  var yardsale = new Yardsale(yardsaleDetail);    
  yardsale.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Yardsale: ' + yardsale);
    yardsales.push(yardsale);
    cb(null, yardsale);
  }  );
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('iamking', 'iamking@gmail.com', '2019-06-06', false, callback);
        },
        function(callback) {
          userCreate('donjuan', 'donjuan@gmail.com', '2019-11-8', false, callback);
        },
        function(callback) {
          userCreate('joeking', 'joeking@gmail.com', '2020-01-02', '1992-04-06', callback);
        },
        function(callback) {
          userCreate('mackd', 'mackd@gmail.com', '2019-09-12', false, callback);
        },
        function(callback) {
          userCreate('hamilton', 'hamilton@gmail.com', '1971-12-16', false, callback);
        },
        function(callback) {
          userCreate('lordofthepuck', 'lordofthepuck@gmail.com', callback);
        },
        function(callback) {
          userCreate('kimbo', 'kimbo@gmail.com', callback);
        },
        function(callback) {
          userCreate('jenna', 'jenna@gmail', callback);
        },
        ],
        // optional callback
        cb);
}

function createYardsales(cb) {
    async.parallel([
        function(callback) {
          bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate('Test Book 1', 'Summary of test book 1', 'ISBN111111', authors[4], [genres[0],genres[1]], callback);
        },
        function(callback) {
          bookCreate('Test Book 2', 'Summary of test book 2', 'ISBN222222', authors[4], false, callback);
        }
        ],
        // optional callback
        cb);
}

// Instance method for hashing user-typed password.
User.methods.setPassword = function(password) {
	// Create a salt for the user.
	this.salt = crypto.randomBytes(16).toString('hex');
	// Use salt to create hashed password.
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 128, 'sha512')
		.toString('hex');
};


async.series([
    createUsers,
    createYardsales
  ],
// Optional callback
function(err, results) {
    if (err) {
        console.log(`FINAL ERR: ${err}`);
    }
    else {
        console.log(`Yard Sales: ${yardsales}`);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




