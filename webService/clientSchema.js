var mongoose = require('mongoose');
var schema = mongoose.Schema;

var clientSchema = new schema({
	name: String,
	favorite: [String],
	email: String,
	type: String
}, {collection: "Users"});

var clients  = mongoose.model('Users', clientSchema);

module.exports = clients;

