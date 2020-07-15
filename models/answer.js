var mongoose=require("mongoose");

var answerScehma=new mongoose.Schema({
	content:String,
	isRight:Boolean 
});

module.exports=mongoose.model("Answer",answerScehma);

