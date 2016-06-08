var express = require('express');
var app = express();
var recipesController = require('./recipesController');

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

app.set('admin/updateSteps/:recipeName/:steps', function(req, res) {
	recipesController.updateSteps(req.params.recipeName, req.params.steps);
})
//app.get('/ws_todo/saveActionData', todoAction.saveData);
app.listen(port);
console.log('listening on port 3000');
