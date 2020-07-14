var mongoose=require("mongoose");

var questionScehma=new mongoose.Schema({
	_id:Number,
	title:String,
	options:[{type:String}],
	//options:String,
	answer:String
});

module.exports=mongoose.model("Question",questionScehma);
