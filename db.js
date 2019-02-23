// Set up mongoose connection
const mongoose = require('mongoose');
const debug = require('debug')('yardy:mongo');
let dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(() => {
    console.log("Connected to mLab Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));