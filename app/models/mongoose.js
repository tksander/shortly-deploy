var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
mongoose.connect('mongodb://MongoLab_Tommy:m0KbysBscfeQx6xdL4qnydKSitsRILVSo4mnOtMYS0s-@ds042898.mongolab.com:42898/MongoLab_Tommy');

// making links ********************************************

var linkSchema = new Schema({
  url: String,
  code: String,
  title: String,
  base_url: String,
  visits: Number
});

linkSchema.set('toObject', {getters: true}, {virtuals: false});

var Link = mongoose.model('Link', linkSchema);

var computeLinkCode = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

var linkMaker = function(url, title, base_url) {
  var code = computeLinkCode(url);
  var linkModel = new Link({
                            url: url, 
                            code: code,
                            title: title,
                            base_url: base_url,
                            visits: 0 });
  return linkModel;
};


// making users ********************************************

var userSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
});

userSchema.set('toObject', {getters: true}, {virtuals: false});

var User = mongoose.model('User', userSchema);

var userMaker = function(username, password) {
  var hash = bcrypt.hashSync(password);
  var userModel = new User({
                            username: username,
                            password: hash
  });
  return userModel;
};







// interacting with backbone ********************************************


var cleanMongo = function(mongoArray) {
  var resultArray = [];
  mongoArray.forEach(function(item) {
    item  = item.toObject();
    resultArray.push(item);
  })
  return resultArray;
}




// exports ********************************************
exports.Link = Link;
exports.linkMaker = linkMaker;
exports.cleanMongo = cleanMongo;
exports.User = User;
exports.userMaker = userMaker; 















