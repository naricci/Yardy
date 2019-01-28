const Sequelize = require('sequelize');

var userName = 'NRicci';
var password = '001405200';
var hostName = 'sql.neit.edu';
var DbName = 'SE425_Yardy';

// Initialize Sequelize to connect to sample DB
var sampleDb = new Sequelize(DbName, userName, password, {
    dialect: 'mssql',
    host: 'sql.neit.edu',
    port: 4500, // Default port
    logging: false, // disable logging; default: console.log

    dialectOptions: {
        requestTimeout: 30000 // timeout = 30 seconds
    }
});

// Define the 'Users' model
var Users = sampleDb.define('users', {
    userId: Sequelize.INTEGER,
    username: Sequelize.STRING(25),
    password: Sequelize.STRING(25),
    isValidated: Sequelize.BOOLEAN,
    firstName: Sequelize.STRING(25),
    lastName: Sequelize.STRING(25),
    email: Sequelize.STRING(25),
    phone: Sequelize.STRING(10),
    address: Sequelize.STRING(360),
    address2: Sequelize.STRING(25),
    city: Sequelize.STRING(25),
    state: Sequelize.STRING(25),
    zipcode: Sequelize.STRING(5)
});

// Define the 'Favorites' model
var Favorites = sampleDb.define('favorites', {
    yardSaleId: Sequelize.INTEGER,
    isChecked: Sequelize.BOOLEAN
});

// Define the 'YardSales' model
var YardSales = sampleDb.define('yardsales', {
    yardSaleId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    dateStart: Sequelize.DATEONLY,
    dateEnd: Sequelize.DATEONLY,
    timeStart: Sequelize.DATE,
    timeEnd: Sequelize.DATE,
    details: Sequelize.STRING(250),
    imageName: Sequelize.STRING(100)
});

// SELECT * FROM Users
// sampleDb.query("SELECT * FROM Users").then(myTableRows => {
//     console.log(myTableRows)
// });

// SELECT * FROM YardSales
// sampleDb.query("SELECT * FROM YardSales").then(myTableRows => {
//     console.log(myTableRows)
// });

// SELECT * FROM Favorites
// sampleDb.query("SELECT * FROM Favorites").then(myTableRows => {
//     console.log(myTableRows)
// });

// const Op = Sequelize.Op;
//
// Users.findAll({
//     where: {
//         authorId: 4
//     }
// });