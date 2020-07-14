var mongoose = require("mongoose");
var Question   = require("./models/question");
var User   = require("./models/user");

var data = [
    {
        _id:0,
		title: "question 0", 
		options:['A','B','C','D'],
        answer: '1'
    },
    {
        _id:1,
		title: "question 1", 
		options:['A','B','C','D'],
        answer: '2'
    },
	    {
        _id:2,
		title: "question 2", 
		options:['A','B','C','D'],
        answer: '1'
    },
    {
        _id:3,
		title: "question 3", 
		options:['A','B','C','D'],
        answer: '2'
    },
    {
        _id:4,
		title: "question 4", 
		options:['A','B','C','D'],
        answer: '2'
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
