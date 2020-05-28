var express          = require("express"),
    bodyParser       = require("body-parser"), // for req.body.... (post request)
    flash            = require("connect-flash"),
    request          = require("request"), // for API
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    expressSession   = require("express-session"),
    Campground       = require("./models/campgrounds"),
    Comment          = require("./models/comments"),
    User             = require("./models/users"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");


var app = express();

app.set("view engine", "ejs"); // ejs is imported

var url = process.env.yelp_campdburl || "mongodb://localhost/yelp_camp"
mongoose.connect(url); // also auto creates db if its none existent

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); //before passport config!
// passport config
app.use(expressSession({
    secret: "Hello Bye",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// calling function in app.use will be called on every route
app.use(function(req, res, next){
    //passport creates req.user and locals is local variable
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started!")
});