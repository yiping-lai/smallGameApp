var mongoose = require("mongoose");
var Question   = require("./models/question");
var User   = require("./models/user");

var data = [
    {
        _id:0,
		title: "Name the currency used in Japan.", 
		options:['Taka','Dinar','Ngultrum','Yen'],
        answer: '3'
    },
    {
        _id:1,
		title: "Which colors must be mixed together to make green?", 
		options:['Orange and blue','Red and blue','Blue and yellow','Black and yellow'],
        answer: '1'
    },
	    {
        _id:2,
		title: "In which country is the Leaning Tower of Pisa located?", 
		options:['England','Spain','France','Italy'],
        answer: '3'
    },
    {
        _id:3,
		title: "Which animal is the tallest in the world?", 
		options:['Elephant','Giraffe','Zebra','Kangaroo'],
        answer: '1'
    },
    {
        _id:4,
		title: "How many Earths could fit inside the sun?", 
		options:['1','130','1300','1.3 million'],
        answer: '3'
    }	
]

function seedDB(){
   //Remove all campgrounds
   User.remove({},function(err){
	   if(err){
		   console.log(err);
	   }
   })
   Question.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed questions!");
         //add a few campgrounds
        data.forEach(function(seed){
            Question.create(seed, function(err, question){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
