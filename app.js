var express=require("express"),
	app=express(),
	mongoose=require("mongoose"),
	passport=require("passport"),
	bodyParser=require("body-parser"),
	LocalStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	User=require("./models/user"),
	Question=require("./models/question"),
	seedDB      = require("./seeds");

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true }); 
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

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

// make userid available for all routes
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});


//seedDB();

//=========================
// Routes
//=========================

app.get("/",function(req,res){
	res.render("home",{user:req.user});
});


app.get("/final",isLoggedIn,function(req,res){
	res.render("gameEnd",{user:req.user,lastStatus:req.query.status});
});


// getQuestion logic
app.get("/questions/:id",isLoggedIn,function(req,res){
		Question.findById(req.params.id,function(err,foundQuestion){
			if (err){
				console.log("Error in get question.");
			}else{
				res.render("show",{question:foundQuestion,lastStatus:req.query.status});	
			}
		});
});

// submit logic
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
				

				// redirect to next question or final page
				if(req.params.id==4){
					res.redirect('/final/?status='+ansStatus);
				}else{
					res.redirect('/questions/'+(Number(req.params.id)+1)+'/?status='+ansStatus);		
				}	
			}
		});
});



// handling user sign up
app.post("/register",function(req,res){
	req.body.password='fakePassword';
;	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			// use return to short circuit everything
			console.log(err);
			res.redirect("/");
		}
		// log user in with serialized method with type---local
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
		
	});
});


// middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/register");
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
