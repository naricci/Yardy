const Yardsale = require('../models/yardsales.model');

exports.all_yardsales = (req, res) => {
    console.log("All Yardsales");

    Yardsale.find()
    .exec()
    .then (yardsales_controller => {
        res.send(yardsales_controller);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};