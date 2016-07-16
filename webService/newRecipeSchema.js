var mongoose = require('mongoose');
var schema = mongoose.Schema;

//These schemes allow us to build the actual "Recipe" schema without any mistakes.
//They have no meaning outside of this page

var ingredientsSchema = new schema({
	name:String,
	quantity:String
});

var actionSchema = new schema({
	action:String,
	time:Number,
    kind:String,
    imageURL:String
});


//This is the actual real schema from this page/ which builted from the two schemas above

var Recipe = new schema({
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

var recipes = mongoose.model('Recipes', Recipe);

module.exports = recipes;
