var mongoose = require("mongoose");
var Question   = require("./models/question");
var User   = require("./models/user");
var Answer=require("./models/answer");

var data = [
    {
        _id:0,
		title: "Name the currency used in Japan.", 
		options:[{content:'Taka',isRight:false},
				 {content:'Dinar',isRight:false},
				 {content:'Ngultrum',isRight:false},
				 {content:'Yen',isRight:true}]
    },
    {
        _id:1,
		title: "Which colors must be mixed together to make green?", 
		options:[{content:'Orange and blue',isRight:false},
				 {content:'Red and blue',isRight:true},
				 {content:'Blue and yellow',isRight:false},
				 {content:'Black and yellow',isRight:false}]		
    },
	    {
        _id:2,
		title: "In which country is the Leaning Tower of Pisa located?", 
		options:[{content:'England',isRight:false},
				 {content:'Spain',isRight:false},
				 {content:'France',isRight:false},
				 {content:'Italy',isRight:true}]				
    },
    {
        _id:3,
		title: "Which animal is the tallest in the world?", 
		options:[{content:'Elephant',isRight:false},
				 {content:'Giraffe',isRight:true},
				 {content:'Zebra',isRight:false},
				 {content:'Kangaroo',isRight:false}]			
    },
    {
        _id:4,
		title: "How many Earths could fit inside the sun?", 
		options:[{content:'1',isRight:false},
				 {content:'130',isRight:false},
				 {content:'1300',isRight:false},
				 {content:'1.3 million',isRight:true}]			
    }	
];

function seedAnswer(){
	data.forEach(function(seed){
		seed.options.forEach(function(option){
			Answer.create(option,function(err,answer){
				if(err){
					console.log(err);
				}else{
					console.log('Answer created');
					Question.findById(seed._id,function(err,question){
						question.answerOptions.push(answer);
						question.save();
					});
				}
				
			})
		});
	})
};

module.exports = seedAnswer;
