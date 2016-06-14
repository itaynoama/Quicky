var mongoose = require('mongoose');
var recipes = require('./newRecipeSchema.js');
var clients = require('./clientSchema.js');

function getRecipe(recipeName, callback) {
	var query = recipes.findOne().where('name', recipeName);
    query.exec(function(err, doc){
		if (err) {
			console.log("failed to find the recipe");
			return;
		} else{
			callback(doc);
		}
    });
}

exports.getRecipe;

exports.getUnmodifiedRecipes = function(req, res) {
	var query = recipes.find();
	query.where('modified', false).select('-_id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		console.log(json);
//		console.log(typeof json);
		var parse = JSON.parse(json);
		console.log(parse);
		//console.log(parse[0].ingredients[0].side);
        res.json(docs);
	});
}

exports.getModifiedRecipes = function(time) {
	var query = recipes.find();
	query.where('timers.total', time).select('-_id').select('-timers._id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		var parse = JSON.parse(json);
		console.log(json);
		console.log(parse);
		res.json(docs);
	})
}

//exports.updateSteps = function(recipeName, steps) {
//	var query = recipes.findOne().where('name', recipeName);
//	query.exec(function(err, doc) {
//		if (err) {
//			console.log("error");
//			return;
//		}else {
//			doc.set('steps', steps);
//			doc.set('modified', true);
//			doc.save(function(err) {
//				if (err) {
//					console.log("failed to update");
//					return;
//				}else {
//					console.log("updating complete");
//				console.log(doc);
//				}
//
//			});
//		}
//
//	});
//}


exports.updateSteps = function(recipeName, steps) {
	getRecipe(recipeName, function(doc) {
		doc.set('steps', steps);
		doc.set('modified', true);
		doc.save(function(err) {
			if (err) {
				console.log("failed saving");
			}
			else{
				console.log("updating complete");
			}
		});
	});
}

exports.increaseLikes = function(recipeName) {
	getRecipe(recipeName, function(doc) {
		var query = doc.update({$inc: {likes: 1}});
		query.exec(function(err) {
			if (err) {
				console.log("failed incrementing the 'like' of recipe");
			} else {
				console.log("likes updated");
			}
		});
	});
}

exports.findClient = function(email, callback) {
	var query = clients.findOne().where('email', email);
	query.exec(function(err, doc) {
		if (err) {
			var error1 = "error searching fo client";
			console.log(error1);
			callback(error1);
		} else if (!doc) {
			//person is not exist
			var client = new clients({
				favorite: [],
				email: email,
				type: 'Cooker'
			});
			client.save(function(err, doc) {
				if (err) {
					var error2 = "failed creating new client";
					console.log(error2);
					callback(error2);
				} else {
					console.log("new client created:\n" + doc);
					callback("Cooker");
				}
			});
		} else {
			if (doc.type === "Admin") callback("Admin");
			else callback("Cooker");
		}
	})
}

exports.addFavorite = function(email, recipeName) {
	var query = clients.findOne().where('email', email);
	query.exec(function(err, doc) {
		if (err) {
			console.log('error searching for client');
		} else if (!doc){
			console.log('client does not exist');
		} else {
			var query2 = doc.update({$push:{favorite: recipeName}});
			query2.exec(function(err) {
				if (err) {
					console.log('failed to update client');
				} else {
					console.log('success in updating client');
				}
			});
		}
	});
}



