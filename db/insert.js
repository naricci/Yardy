var Connection = require('tedious').Connection,
    Request = require('tedious').Request,
    TYPES = require('tedious').TYPES;

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

connection.on('connect', function(err){
    var request = new Request("INSERT INTO Users (Username, Password) VALUES (@Username, @Password)",
        function(err){
            if(err){
                console.log(err);
            };
        });

    // request.addParameter('uniqueIdVal', TYPES.UniqueIdentifierN,'ba46b824-487b-4e7d-8fb9-703acdf954e5');
    request.addParameter('username', TYPES.VarChar, 25);
    request.addParameter('password', TYPES.VarChar, 25);

    connection.execSql(request);
});