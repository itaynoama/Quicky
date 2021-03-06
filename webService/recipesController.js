var mongoose = require('mongoose');
var recipes = require('./newRecipeSchema.js');
var clients = require('./clientSchema.js');

//increaing likes to recipe
function increaseLikes(recipeName, callback) {
    console.log("increasing likes");
	getRecipe(recipeName, function(doc) {
        if (doc.status) {
            var query = doc.data.update({$inc: {likes: 1}});
            query.exec(function(err) {
			if (err) {
				console.log("failed incrementing the 'like' of recipe");
			} else {
				console.log("likes updated");
			}
            callback();
            });
        } else {
            callback();
        }

	});
}

//decreasing like to recipe
function decreaseLikes(recipeName, callback) {
	getRecipe(recipeName, function(doc) {
        if (doc.data) {
            if (doc.data.likes == 0) {
            callback();
            return;
            }
            var query = doc.data.update({$inc: {likes: -1}});
            query.exec(function(err) {
                if (err) {
                    console.log("failed decrementing the 'like' of recipe");
                } else {
                    console.log("likes decremented");
                }
                callback();
            });
        } else {
            callback();
        }
	});
}

//fetching specific recipe
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

//getting all the recipes that the admin still didn't make steps
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

//the recipes that are ready to display for the client
exports.getModifiedRecipes = function(time, callback) {
	var query = recipes.find();
	query.where('timers.total', time).select('-_id');
	query.exec(function(err, docs) {
        if (err || !docs) {
            callback({status: false});
        } else {
            callback({status: true, data: docs});
        }
	})
}

//updating the steps that the admin has made for specific recipe
exports.updateSteps = function(recipeName, steps, prep, cook, total, callback) {
	getRecipe(recipeName, function(doc) {
        if (doc.status) {
            doc.data.set('steps', steps);
            doc.data.set('modified', true);
            doc.data.set('timers.preparation', prep);
            doc.data.set('timers.cooking', cook);
            doc.data.set('timers.total', total);
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

//fetching cleint data
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
					callback({type: true, data: doc});
				}
			});
		} else {
			callback({type: true, data: doc});
		}
	})
}

exports.getClient = getClient;

//add recipe to client's favorites
exports.addFavorite = function(recipeName, email, callback) {
    getClient(email, function(answer) {
        if (!answer.type) {
            callback({status: false});
        } else {
            var client = answer.data;
            var size = client.favorite.length;
            var exist = false
            for (var i = 0; i < size; i++) {
                if (client.favorite[i] == recipeName) {
                    exist = true;
                    break;
                }
            }
            var query;
            if (exist) query = client.update({$pull:{favorite: recipeName}});
            else query = client.update({$push:{favorite: recipeName}});
            query.exec(function(err) {
				if (err) {
					console.log('failed to update client');
                    callback({status: false});
				} else {
					console.log('success in updating client');
                    if (exist) {
                        decreaseLikes(recipeName, function() {
                            callback({status: true});
                        });
                    }else{
                        increaseLikes(recipeName, function() {
                            callback({status: true});
                        });
                    }

				}
			});
        }
    });
}

//receiving "favor" = name list of client's favorits recipes
//retreiving those favorites recipes
//"favor" is an Array
exports.getFavorites = function(favor, callback) {
    recipes.find({'name': { $in: favor}}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            callback(data);
        }
    })
}


