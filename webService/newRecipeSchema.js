var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ingredientsSchema = new schema({
	name:String,
	quantity:String
});

var actionSchema = new schema({
	action:String,
	time:Number
});



var recipeSchema = new schema({
	name: {type:String, required:true, index:1, unique:true},
	displayName:String,
	description: {type:String, required:true},
	category: {type:String, required:true},
	features: String,
	ingredients: {
		side: {
			kind:String,
			ingredients:[ingredientsSchema]
		},
		main:{
			kind:String,
			ingredients:[ingredientsSchema]
		}
	},
	steps:{
		preparation:[actionSchema],
		cooking:[actionSchema]
	},
	timers:{
		preparation:Number,
		cooking:Number,
		total:Number
	},
	imageUrl:String,
	likes:Number,
	modified:Boolean
}, {collection: "Recipes"});

var recipes = mongoose.model('Recipes', recipeSchema);

module.exports = recipes;
