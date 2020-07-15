var express=require("express"),
	app=express(),
	mongoose=require("mongoose"),
	passport=require("passport"),
	bodyParser=require("body-parser"),
	LocalStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	User=require("./models/user"),
	Question=require("./models/question"),
	flash=require("connect-flash"),
	seedDB      = require("./seeds");


//=========================
// Setup app
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

//=========================
// Routes
//=========================


// Signup API: show sign up or start game based on user status
app.get("/",function(req,res){
	res.render("home",{user:req.user});
});


// final page. Display results.
app.get("/final",isLoggedIn,function(req,res){
	res.render("gameEnd",{user:req.user,lastStatus:req.query.status});
});


// GetQuestion API: getQuestion logic		
app.get("/questions/:id",isLoggedIn,function(req,res){
		// if question doesn't exist, go to final page.	
		var id_value=Number(req.params.id);
		if (id_value<0 || id_value>4){
			res.redirect('/final');
		}
	
		Question.findById(req.params.id,function(err,foundQuestion){
			// invalid request
			if (err){
				req.flash("error",err);
				res.redirect('/final');
			}else{
				res.render("show",{question:foundQuestion,lastStatus:req.query.status});
			}
		});
});

// Submit answer API: check if answer if correct and go to next question.
app.post("/questions/:id",isLoggedIn,function(req,res){
		Question.findById(req.params.id,function(err,foundQuestion){
			if (err){
				console.log("Error in submit question.");
			}else{
				
				// update score and ansStatus 
				var ansStatus='wrong';
				if (foundQuestion.answer==req.body.optionSelected){
					ansStatus='right';
					req.user.score+=20;
				}
				req.user.answers.push(ansStatus);
				User.findByIdAndUpdate(req.user._id,req.user,function(err,updatedUser){
					if (err){
						console.log(err);
					}
				})	
				

				// redirect to next question
				res.redirect('/questions/'+(Number(req.params.id)+1)+'/?status='+ansStatus);		
	
			}
		});
});



// handling user sign up
app.post("/register",function(req,res){
	// validate email format
	
	req.body.password='fakePassword';
;	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			// use return to short circuit everything
			console.log(err);
			req.flash("error","Email has been registered. Please try a different email.");
			return res.redirect("/");			
		}
		// log user in with serialized method with type---local
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
		
	});
});

// logout
app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out.");
	res.redirect("/")
})



//=========================
// middleware
//=========================
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}



if (process.env.DEVELOPER==='1'){
	app.listen(3000, function() { 
		console.log('Server listening on port 3000'); 
	});
}else{
	app.listen(process.env.PORT, process.env.IP, function(){
  		console.log('Server listening on port 3000'); 
	});
};
