var mongoose = require('mongoose');
var recipes = require('./newRecipeSchema.js');
var clients = require('./clientSchema.js');

function increaseLikes(recipeName) {
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

function getRecipe(recipeName, callback) {
	var query = recipes.findOne().where('name', recipeName);
    query.exec(function(err, doc){
		if (err) {
            var error = "failed to find the recipe";
			console.log(error);
            callback({status: false, data: error});
		} else{
			callback({status: true, data: doc});
		}
    });
}

exports.getRecipe = getRecipe;

exports.getUnmodifiedRecipes = function(req, res) {
	var query = recipes.find();
	query.where('modified', false).select('-_id');
	query.exec(function(err, docs) {
        if (err) {
            res.json({error: "failed to load recipes"})
        } else  {
            res.json(docs);
        }

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

exports.updateSteps = function(recipeName, steps, prep, cook, callback) {
	getRecipe(recipeName, function(doc) {
        if (doc.status) {
            doc.data.set('steps', steps);
            doc.data.set('modified', true);
            doc.data.set('timers.prepration', prep);
            doc.data.set('timers.cooking', cook);
            doc.data.set('timers.total', cook+prep);
            doc.data.save(function(err) {
			if (err) {

				console.log("failed saving");
                callback({status: false});
			}
			else{
				console.log("updating complete");
                callback({status: true});
			}
		});
        }




	});
}

function getClient(email, callback) {
	var query = clients.findOne().where('email', email);
	query.exec(function(err, doc) {
		if (err) {
			var error1 = "error searching fo client";
			console.log(error1);
			callback({type: false, data: error1});
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
					callback({type: false, data: error2});
				} else {
					console.log("new client created:\n" + doc);
					callback({type: true, data: doc.type});
				}
			});
		} else {
			if (doc.type == "Admin") callback({type: true, data: doc.type});
			else callback({type: true, data: doc.type});
		}
	})
}

exports.getClient = getClient;

exports.addFavorite = function(recipeName, email, callback) {
    getClient(email, function(answer) {
        if (!answer.type) {
            console.log(answer.data);
            callback({status: false});
        } else {
            var client = answer.data;
            var query = client.update({$push:{favorite: recipeName}});
            query.exec(function(err) {
				if (err) {
					console.log('failed to update client');
                    callback({status: false});
				} else {
					console.log('success in updating client');
                    increaseLikes(recipeName);
                    callback({status: true});
				}
			});
        }
    });
}



