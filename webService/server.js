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
    console.log('get modified called with time: ' + req.params.time)
	recipesController.getModifiedRecipes(req.params.time, function(data) {
        if (data.status) {
            console.log("sending the result");
            res.json(data.data);
        } else {
            res.status(301);
            res.send();
        }
    });
});

app.post('/admin/updateSteps/:recipeName', function(req, res) {

    recipesController.updateSteps(req.params.recipeName, req.body.steps,req.body.prepare, req.body.cook, function(data) {
        if (data.status) res.status(200);
        else res.status(301);
        res.send();
    });
});

app.get('/checkClient/:email', function(req, res) {
	recipesController.getClient(req.params.email, function(data) {
        if (data.type) {
            res.json({type: data.data});
        }
        else {
            res.json({error: data.data});
        }
	})
})

app.post('/admin/addToFavorites/:recipeName', function(req, res) {
    recipesController.addFavorite(req.params.recipeName, req.body.email, function(data) {
            if (data.status) {
                res.status(200);
            } else {
                res.status(301);
            }
        res.send();
    });
})

//app.get('/admin/updateLikes/:recipeName', function(req, res) {
//	recipesController.increaseLikes(req.params.recipeName, function(data) {
//        if (data.status) {
//            res.status(200);
//        } else {
//            res.status(301);
//        }
//        res.send();
//    });
//})

//app.get('admin/getRecipe/:recipeName', function(req,res) {
//    recipesController.getRecipe(req.params.recipeName)
//});



app.listen(port);
console.log('listening on port 3000');
