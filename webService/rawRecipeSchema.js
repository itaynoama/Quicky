var mongoose = require('mongoose');
var schema = mongoose.Schema;
raawRecipeSchema = new schema({
	name: {type:String, index:1, required:true, unique:false},
	id: {type:Number, required:true, unique:true},
	year: {type:Number, required:true},
	grade: {type:Number}
}, {collection: "Students"});

var students = mongoose.model('Students', studentSchema);

module.exports = students;
