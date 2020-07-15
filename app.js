var express=require("express"),
	app=express(),
	mongoose=require("mongoose"),
	passport=require("passport"),
	bodyParser=require("body-parser"),
	LocalStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	User=require("./models/user"),
	Question=require("./models/question"),
	Answer=require("./models/answer"),
	flash=require("connect-flash"),
	seedDB      = require("./seeds"),
	seedAnswer      = require("./seedAnswer");	


//=========================
// Config app
//=========================

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true }); 
app.set("view engine","ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public")); 

// set up password for user auth 
app.use(require("express-session")({
		secret:"my super secret",
		resave:false,
		saveUnintialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make global variables
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


seedDB();
//seedAnswer();

//=========================
// Routes
//=========================


// Signup API: show sign up or start game based on user status
app.get("/",function(req,res){
	res.render("home",{user:req.user});
});


// final page. Display results.
app.get("/final",isLoggedIn,function(req,res){
	// calculate score and make sure all questions are answered.
	var score=0;
	for(var i=0; i<req.user.answers.length;i++){
		if (req.user.answers[i]==-1){
			res.redirect("/questions/"+i);
			return;
		}
		score+=req.user.answers[i];
	}
	var lastStatus='wrong';
	if (req.user.answers[req.user.answers.length-1]==20){
		lastStatus='right'
	}
	
	res.render("gameEnd",{user:req.user,score:score,lastStatus:lastStatus});
});


// GetQuestion API: getQuestion logic		
app.get("/questions/:id",isLoggedIn,function(req,res){
	var id_value=Number(req.params.id);
	var lastStatus;
	
	// if question id doesn't exist, go to final page
	if (id_value<0 || id_value>4){
		res.redirect('/final');
		
	// if previous question not answered, go to previous question
	}else if(id_value>0 && req.user.answers[id_value-1]==-1){
		res.redirect('/questions/'+(id_value-1));
	
	// if current question answered, go to next question
	}else if(req.user.answers[id_value]!=-1){
		res.redirect('/questions/'+(id_value+1));
	
	// answer current question
	}else{
		// update lastStatus
		if(id_value>0){
			if (req.user.answers[id_value-1]==0){
				lastStatus='wrong';
			}else{
				lastStatus='right';
			}
		}
		Question.findById(req.params.id).populate("answerOptions").exec(function(err,foundQuestion){
			if (err){
				req.flash("error",err);
				res.redirect('/');
			}else{
				res.render("show",{question:foundQuestion,lastStatus:lastStatus});
			}
		});

	}

});

// Submit answer API: check if answer if correct and go to next question.
app.post("/questions/:id",isLoggedIn,function(req,res){
	
	// update answeres
	if (req.body.optionSelected=='true'){
		ansStatus='right';
		req.user.answers[Number(req.params.id)]=20;
	}else{
		req.user.answers[Number(req.params.id)]=0;
		if(req.body.optionSelected!='false'){
			req.flash("error","Time is over.");
		}
	}

	User.findByIdAndUpdate(req.user._id,req.user,function(err,updatedUser){
		if (err){
			console.log(err);
		}
	});

	// go to next question
	res.redirect('/questions/'+(Number(req.params.id)+1));		

});



// handling user sign up
app.post("/register",function(req,res){
	req.body.password='fakePassword';
;	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			// use return to short circuit everything
			console.log(err);
			req.flash("error","Email has been registered. Please try a different email.");
			return res.redirect("/");			
		}else{
			// log user in with serialized method with type---local
			passport.authenticate("local")(req,res,function(){
			res.redirect("/");			
			});
		};
		
	});
});

// logout
app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out.");
	res.redirect("/")
})



if (process.env.DEVELOPER==='1'){
	app.listen(3000, function() { 
		console.log('Server listening on port 3000'); 
	});
}else{
	app.listen(process.env.PORT, process.env.IP, function(){
  		console.log('Server listening on port 3000'); 
	});
};

//=========================
// middleware
//=========================
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}



