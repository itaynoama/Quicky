var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ingredientsSchema = new schema({
	name:String,
	quantity:String
});

var subIngredientsSchema = new schema({
	kind:String,
	ingredients:[ingredientsSchema]
});

var actionSchema = new schema({
	description:String,
	time:Number
});

var stepsSchema = new schema({
	kind:String,
	action:actionSchema
});

var timerSchema = new schema({
	kind:String,
	time:Number
});

var recipeSchema = new schema({
	name: {type:String, required:true, unique:true},
	description: {type:String, required:true},
	category: {type:String, required:true},
	features: String,
	ingredients: {
		side:[subIngredientsSchema],
		main:[subIngredientsSchema]
	},
	Steps:[stepsSchema],
	timers:[timerSchema],
	imageUrl:String,
	likes:Number,
	modified:Boolean
}, {collection: "Recipes"});

var recipes = mongoose.model('Recipes', recipeSchema);

module.exports = recipes;
