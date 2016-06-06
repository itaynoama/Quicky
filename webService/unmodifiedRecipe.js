var mongoose = require('mongoose');
var schema = mongoose.Schema;
//rawRecipeSchema = new schema({
//	name: {type:String, index:1, required:true, unique:false},
//	id: {type:Number, required:true, unique:true},
//	year: {type:Number, required:true},
//	grade: {type:Number}
//}, {collection: "Students"});

unmodifiedRecipeSchema = new schema({
	name: {type:String, index:1, required:true, unique:true},
	description: {type:String, required:true},
	category: {type:String, required:true},
	features: String,
	ingredients: {
		side: {
			type:String,
			ingredients: {
				name:String,
				quantity:String
			}
		},
		main: {
			type:String,
			ingredients: {
				name:String,
				quantity:String
			}
		}
	},
	Steps:[String],
	timers: {
		type:String,
		time:Number
	},
	imageUrl:String,
	likes:Number,
	modified:Boolean
}, {collection: "Recipes"});

var recipes = mongoose.model('Recipes', unmodifiedRecipeSchema);

module.exports = recipes;
