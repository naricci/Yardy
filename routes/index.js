const express = require('express');
const router = express.Router();
const sql = require('mssql');
const async = require('async');
const debug = require('debug')('Yardy:index');

// var config = {
//   server: 'sql.neit.edu.SE425_Yardy.windows.net',
//   database: 'SE425_Yardy',
//   user: 'NRicci',
//   password: '001405200',
//   port: 1433
// };

// const config = {
//   server: 'sql.neit.edu.SE425_Yardy.windows.net',
//   options: {
//     // port: 4500,
//     encrypt: false,
//     database: 'SE425_Yardy'
//   }, authentication: {
//     type: "default",
//     options: {
//       userName: 'NRicci',
//       password: '001405200'
//     }
//   }
// };

// const Connection = require('tedious').Connection,
//     Request = require('tedious').Request,
//     TYPES = require('tedious').TYPES;

var config = {
    server: 'sql.neit.edu.SE425_Yardy.windows.net',
    options: {
        port: 1433, // or 4500
        //encrypt: true,
        database: 'SE425_Yardy'
    }, authentication: {
        type: "default",
        options: {
            userName: 'NRicci',
            password: '001405200'
        }
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //debug(title);
  // GetData(function (recordset) {
  //   res.render('index', {yardsales: recordset})
  // });
//   var sql = require('mssql');

//   // configure mssql db connection
//   var config = {
//     user: 'NRicci',
//     password: '001405200',
//     server: 'sql.neit.edu.SE425_Yardy.windows.net', 
//     database: 'SE425_Yardy',
//     port: 4500
//   };

//   // connect to db
//   sql.connect(config, function(err) {

//     if (err) console.log(err);

//     // create Request object
//     var request = new sql.Request();

//     // query to the database and get records
//     request.query('SELECT * FROM Users', function(err, recordset) {

//       if (err) console.log(err)

//       // send records as a response
//       res.send(recordset)
//     })
//   })
  loadEmployees();
});

function loadEmployees() {
  //4.
  var dbConn = new sql.Connection(config);
  //5.
  dbConn.connect().then(function () {
      //6.
      var request = new sql.Request(dbConn);
      //7.
      request.query("select * from Users").then(function (recordSet) {
          console.log(recordSet);
          console.JSON(recordSet);
          dbConn.close();
      }).catch(function (err) {
          //8.
          console.log(err);
          dbConn.close();
      });
  }).catch(function (err) {
      //9.
      console.log(err);
  });
}

// function GetData(callback) {
//   var sql = require('mssql');
//   var config = {
//     server: 'sql.neit.edu.SE425_Yardy.windows.net',
//     options: {
//       port: 4500,
//       encrypt: true,
//       database: 'SE425_Yardy'
//     }, authentication: {
//       type: "default",
//       options: {
//         userName: 'NRicci',
//         password: '001405200'
//       }
//     }
//   };
//   var connection = new sql.Connection(config, function (err) {
//     // check for errors by inspecting err parameter
//     var request = new sql.Request(connection);
//     request.query('SELECT * FROM YardSales', function (err, recordset) {
//       callback(recordset);
//     });
//   });
// }

/* GET signup page. */
router.get('/signup.html', function(req, res, next) {
  res.render('signup', { title: 'Sign up page' });
});

/* POST signup data */
router.post('/signup.html', function(req, res, next){
  const username = req.body.username;
  const password = req.body.password;
  debug("username=" + username);
  debug("password=" + password);

  var connection = new Connection(config);

  connection.on('connect', function(err){
    var request = new Request("INSERT INTO Users (Username, Password) VALUES (@Username, @Password)",
        function(err){
          if (err) console.log(err);
        });

    request.addParameter('username', TYPES.VarChar, 25);
    request.addParameter('password', TYPES.VarChar, 25);

    connection.execSql(request);
    connection.close();
  });
  res.send("Got a POST request for "+ username);
  // res.render('signup', { title: req.body.username, errors: errors});
});

function insertRow() {
  //2.
  var dbConn = new sql.Connection(config);
  //3.
  dbConn.connect().then(function () {
    //4.
    var transaction = new sql.Transaction(dbConn);
    //5.
    transaction.begin().then(function () {
      //6.
      var request = new sql.Request(transaction);
      //7.
      request.query("Insert into EmployeeInfo (EmpName,Salary,DeptName,Designation) values ('T.M. Sabnis',13000,'Accounts','Lead')")
          .then(function () {
            //8.
            transaction.commit().then(function (recordSet) {
              console.log(recordSet);
              dbConn.close();
            }).catch(function (err) {
              //9.
              console.log("Error in Transaction Commit " + err);
              dbConn.close();
            });
          }).catch(function (err) {
        //10.
        console.log("Error in Transaction Begin " + err);
        dbConn.close();
      });

    }).catch(function (err) {
      //11.
      console.log(err);
      dbConn.close();
    });
  }).catch(function (err) {
    //12.
    console.log(err);
  });
}
//13.


module.exports = router;
