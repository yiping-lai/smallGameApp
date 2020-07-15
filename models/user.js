var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
	username:String,
	passowrd:String,
	answers:{type:Array,
			 default:[-1,-1,-1,-1,-1]},
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);