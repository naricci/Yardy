module.exports = function (app) {

var express = require('express');
var router = express.Router();

const yardsales_controller = require('../controllers/yardsales.controller');

router.use(function(req, res, next) {
  console.log("/" + req.method);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path + "index")
});

/* GET all Yardsales */
app.get('/yardsales', yardsales_controller.all_yardsales)

app.use("/", router);

app.use("*", (req, res) => {
  res.sendFile(path + "error")
})
}

