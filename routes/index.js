
var router = require("express").Router();
var passport = require("passport");
var User   = require("../models/users");
var middleware = require("../middleware");


router.get("/", (req, res) => {
    res.render("home")
});


router.get("/register", (req, res) =>{
    res.render("./auth/register")
})

router.post("/register", (req, res) =>{
    // method from passport-local-mongoose; also checks if user exists
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message); //passport pre-filled error messages
            res.redirect("back")
        } else {
            req.flash("success", `Signed-up! Have a great time ${user.username}!`)
            res.redirect("/");
        }
    })
})

router.get("/login", (req, res) =>{
    res.render("./auth/login")
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), (req, res) => {
});

router.get("/logout", middleware.isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Successfully Logged Out")
    res.redirect("/")
})


module.exports = router;