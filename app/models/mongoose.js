var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

mongoose.connect('mongodb://localhost/test/');

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


var googleLink = modelMaker("https://www.google.com", "Google", "http://shortlyondemandyo.azurewebsites.net/" )
var amazonLink = modelMaker("https://www.amazon.com", "Amazon", "http://shortlyondemandyo.azurewebsites.net/" )

// amazonLink.save(function (err) {
//   if(err) {
//     throw err;
//   }
//   console.log("success");
// });

// googleLink.save(function (err) {
//   if(err) {
//     throw err;
//   }
//   console.log("success");
// });

 // { id: 1,
 //       url: 'http://www.nytimes.com',
 //       base_url: 'http://localhost:4568',
 //       code: 'f606d',
 //       title: 'The New York Times - Breaking News, World News & Multimedia',
 //       visits: 2,
 //       created_at: 1442425547876,
 //       updated_at: 1442425562190 },

var query = Link.find({})

query.exec(function(err, array){
  if(err) throw err


  var backbone = []
  array.forEach(function(item){
    item  = item.toObject();
    backbone.push({attributes:item});
  })

  console.dir(backbone);
})


exports.modelMaker = modelMaker;















