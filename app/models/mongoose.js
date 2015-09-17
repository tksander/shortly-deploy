var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

mongoose.connect('mongodb://localhost/test');

var linkSchema = new Schema({
  url: String,
  code: String,
  title: String,
  base_url: String,
  visits: Number
});

var Link = mongoose.model('Link', linkSchema);

var computeLinkCode = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};


var modelMaker = function(url, title, base_url) {
  var code = computeLinkCode(url);
  var linkModel = new Link({url: url, 
                            code: code,
                            title: title,
                            base_url: base_url,
                            visits: 0 });
  return linkModel;
};

console.log(modelMaker("https://www.google.com", "Google", "http://shortlyondemandyo.azurewebsites.net/" ))


var googleLink = new modelMaker("https://www.google.com", "Google", "http://shortlyondemandyo.azurewebsites.net/" )

googleLink.save(function (err) {
  if(err) {
    throw err;
  }
  console.log("success");
});

exports.modelMaker = modelMaker;