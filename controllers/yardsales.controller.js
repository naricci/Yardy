const Yardsale = require('../models/yardsales.model');
var debug = require('debug')('Yardy: Yardsales search');

function sendJSONresponse(res, status, content){
    res.status(status);
    res.json(conent);
};

exports.yardsale_search = function(req, res){
    debug('Getting all Yardsales');
    Yardsale
        .find()
        .exec()
        .then(function(results){
            sendJSONresponse(res, 200, results);
        })
        .catch(function(err){
            sendJSONresponse(res, 404, err);
        });
};
