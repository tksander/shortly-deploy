var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var mongo = require('../app/models/mongoose');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');
var mongoose = require('mongoose');



exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {

  mongo.Link.find({}).exec(function(err, array){
      if(err) throw err;
      var cleanArray = mongo.cleanMongo(array);
      console.dir(cleanArray);
      res.send(200, cleanArray);
  });


  // Links.reset().fetch().then(function(links) {
  //   console.dir(links.models[0]._events);
  //   res.send(200, links.models);
  // })

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  mongo.Link.find({url: uri}).exec(function(err, found) {
    console.log(found.length);
    console.log(err);
    if(found.length !== 0) {
      console.log("i found something for", uri)
      res.send(200, mongo.cleanMongo(found)[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var  mongoModel = mongo.linkMaker(uri, title, req.headers.origin)
        mongoModel.save(function(err) {
          if(err) {
            throw err;
          }
            res.send(200, mongoModel);
          })
        })
      }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  mongo.User.find({username: username}).exec(function(err, user) {
    if(user.length === 0) {
      res.redirect('/signup');
    } else {
      var validPassword = bcrypt.compareSync(password, user[0].password);
      if(validPassword) {
        util.createSession(req, res, user[0].toObject());
      } else {
        res.redirect('/login');
      }
    }
  });  

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/signup');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  mongo.User.find({username: username}).exec(function(err, user) {
    if(user.length === 0) {
      var user = mongo.userMaker(username, password);
      user.save(function(err){
        if(err) {
          console.log(err);
        }
        util.createSession(req, res, user);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });


  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
};

exports.navToLink = function(req, res) {

  mongo.Link.find({code: req.params[0]}).exec(function(err, linkArray) {
    if(linkArray.length == 0) {
      res.redirect('/')
    } else {
      var url = linkArray[0].url;
      mongo.Link.update({url: url}, {$inc: {visits: 1}}, function(err, rawResponse) {
        console.log(err);
        console.log(rawResponse);
        res.redirect(linkArray[0].url);
      });
    }
  });
    

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};