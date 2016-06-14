var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var recipesController = require('./recipesController');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;


app.set('port', port);

app.use('/', express.static('./public'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
	next();
});

app.get('/admin/getUnmodified', recipesController.getUnmodifiedRecipes);

app.get('/admin/getModified/:time', function(req, res) {
	recipesController.getModifiedRecipes(req.params.time);
});

app.post('/admin/updateSteps/:recipeName', function(req, res) {	recipesController.updateSteps(req.params.recipeName, req.body.steps);
});

app.get('/checkClient/:email', function(req, res) {
	recipesController.findClient(req.params.email, function(data) {
		if (data != 'Admin' && data != 'Cooker') {
			res.json({error: data});
		} else {
			res.json({type: data});
		}
	})
})

app.get('/admin/addToFavorites/:email/:recipeName', function(req, res) {
	recipesController.addFavorite(req.params.email, req.params.recipeName);
})

app.get('/admin/updateLikes/:recipeName', function(req, res) {
	recipesController.increaseLikes(req.params.recipeName);
})

app.get('admin/getRecipe/:recipeName', function(req,res) {
    recipesController.getRecipe(req.params.recipeName)
});


//recipeName.replace(/\s+/, "");

app.listen(port);
console.log('listening on port 3000');
