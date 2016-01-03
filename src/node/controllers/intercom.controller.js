var http = require('http');
var User = require('../models/user.model.js');
var fs = require('fs');

exports.playWhitenoise = function(req, res) {
   try {
       res.set({'Content-Type': 'audio/mp3'});
       var readStream = fs.createReadStream('./src/node/Data/ocean.mp3');
       readStream.pipe(res);

   }
    catch(e){}
}
exports.getRecording = function(req,    res) {
    var buf = new Buffer(req.body.blob, 'base64'); // decode
    fs.writeFile("./test.wav", buf, function(err) {
        if(err) {
        } else {
            if (req.user) {
                User.update({}, {$set:{newFile: true}}, {multi: true}, function(err, users){
                    console.log(users.length)
                })
                try {
                    return res.json({'status': 'success'});
                }
                catch (e) {
                }
            }
        }
    })
}

exports.sendRecording = function(req, res) {

    if (req.user) {
        if (req.user.newFile == true) {
                res.set({'Content-Type': 'audio/wav'});
            var readStream = fs.createReadStream('./test.wav');

            User.update({username: req.user.username}, {$set:{newFile: false}}, {multi:true}, function(err, users){
                });
                readStream.pipe(res);

        }
        else {
            res.send('nah')
        }
    }


}