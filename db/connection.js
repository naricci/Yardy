var Connection = require('tedious').Connection;

var config = {
    server: 'sql.neit.edu.SE425_Yardy.windows.net',
    options: {
        port: 4500,
        encrypt: true,
        database: 'SE425_Yardy'
    }, authentication: {
        type: "default",
        options: {
            userName: 'NRicci',
            password: '001405200'
        }
    }
};

var connection = new Connection(config);

connection.on('connect', function(err) {
    // If no error, then good to proceed.
    console.log("Connected");
    //executeStatement();
});