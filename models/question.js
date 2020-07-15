var mongoose=require("mongoose");

var questionScehma=new mongoose.Schema({
	_id:Number,
	title:String,
	answerOptions:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Answer"
	}]
});

module.exports=mongoose.model("Question",questionScehma);