var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
	username:String,
	passowrd:String,
	score:{type:Number, default:0},
	answers:[{type:String}]
});

// add methods to the user schema
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);