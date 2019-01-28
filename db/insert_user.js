var Connection = require('tedious').Connection;
var config = {
    userName: 'NRicci',
    password: '001405200',
    server: 'sql.neit.edu.SE425_Yardy.windows.net',
    // If you are on Azure SQL Database, you need these next options.
    options: {encrypt: true, database: 'SE425_Yardy'}
};
var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    console.log("Connected");
    executeStatement1();
});

var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

function executeStatement1() {
    request = new Request("INSERT INTO Users (Username, Password, FirstName, LastName) OUTPUT INSERTED.ProductID VALUES (@Username, @Password, @FirstName, @LastName);", function(err) {
        if (err) {
            console.log(err);}
    });
    request.addParameter('Username', TYPES.VarChar,'SQL Server Express 2014');
    request.addParameter('Password', TYPES.VarChar , 'SQLEXPRESS2014');
    request.addParameter('FirstName', TYPES.VarChar, 25);
    request.addParameter('LastName', TYPES.VarChar,25);
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log("User id of inserted user is " + column.value);
            }
        });
    });
    connection.execSql(request);
}