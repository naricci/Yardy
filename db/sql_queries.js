var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
    userName: 'NRicci', // update me
    password: '001405200', // update me
    server: 'sql.neit.edu.SE425_Yardy.windows.net',
    options: {
        port: 4500,
        database: 'SE425_Yardy'
    }
}

var connection = new Connection(config);

function Start(callback) {
    console.log('Starting...');
    callback(null, 'Jake', 'United States');
}

function Insert(username, password, callback) {
    console.log("Inserting '" + username + "' into Table...");

    request = new Request(
        'INSERT INTO SE425_Yardy.Users (Username, Password) OUTPUT INSERTED.Id VALUES (@Username, @Password);',
        function(err, rowCount, rows) {
            if (err) {
                callback(err);
            } else {
                console.log(rowCount + ' row(s) inserted');
                callback(null, 'Nikita', 'United States');
            }
        });
    request.addParameter('Username', TYPES.VarChar, username);
    request.addParameter('Password', TYPES.VarChar, password);

    // Execute SQL statement
    connection.execSql(request);
}

function Update(name, location, callback) {
    console.log("Updating Location to '" + location + "' for '" + name + "'...");

    // Update the employee record requested
    request = new Request(
        'UPDATE TestSchema.Employees SET Location=@Location WHERE Name = @Name;',
        function(err, rowCount, rows) {
            if (err) {
                callback(err);
            } else {
                console.log(rowCount + ' row(s) updated');
                callback(null, 'Jared');
            }
        });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Location', TYPES.NVarChar, location);

    // Execute SQL statement
    connection.execSql(request);
}

function Delete(name, callback) {
    console.log("Deleting '" + name + "' from Table...");

    // Delete the employee record requested
    request = new Request(
        'DELETE FROM TestSchema.Employees WHERE Name = @Name;',
        function(err, rowCount, rows) {
            if (err) {
                callback(err);
            } else {
                console.log(rowCount + ' row(s) deleted');
                callback(null);
            }
        });
    request.addParameter('Name', TYPES.NVarChar, name);

    // Execute SQL statement
    connection.execSql(request);
}

function Read(callback) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        'SELECT Id, Name, Location FROM TestSchema.Employees;',
        function(err, rowCount, rows) {
            if (err) {
                callback(err);
            } else {
                console.log(rowCount + ' row(s) returned');
                callback(null);
            }
        });

    // Print the rows read
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        console.log("Done!");
    }
}

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');

        // Execute all functions in the array serially
        async.waterfall([
            Start,
            Insert,
            Update,
            Delete,
            Read
        ], Complete)
    }
});