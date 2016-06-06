var mongoose = require('mongoose');

mongoose.connect("mongodb://itayor:4438110@ds023303.mlab.com:23303/quicky");
var conn = mongoose.connection;
conn.on('error', function(err) {
	console.log('connection error ' + err);
});
conn.once('open', function() {
	console.log('connection established!!');
});
