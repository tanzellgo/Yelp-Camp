var router = require("express").Router();
var Campground = require("../models/campgrounds");
var Comments = require("../models/comments");
var passport = require("passport"); //isAuthenticated in isLoggedin is from passport
var middleware = require("../middleware"); 


//INDEX ROUTE
router.get("/", (req, res) => {
    Campground.find({}, function(err, camps){
        if(err){
            req.flash("error", "Campgrounds have all been deleted")
            res.redirect("back")
        } else {
            res.render("./campgrounds/index", {venues: camps});
        }
    });   
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("./campgrounds/addcamp")
})

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) =>{
    var name = req.body.name;
    var img = req.body.img;
    var price = req.body.price
    var description = req.body.description
    var author = {id: req.user._id, username: req.user.username};
    var newCamp = {name: name, img: img, price: price, description: description, author: author};
    Campground.create(newCamp, function(err, camp){
        if(err){
            req.flash("error", "Failed to create campground")
            res.redirect("back")
        } else {
            console.log(camp);
            req.flash("success", "Campground created")
            res.redirect("/campgrounds"); //will default as a get request
        }
    });  
});

//SHOW ROUTE
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err || !camp){
            req.flash("error", "Campground not found")
            res.redirect("back")
        } else {
            res.render("./campgrounds/show", {campground: camp})
        }
    })
})

//EDIT ROUTE
router.get("/:id/edit", middleware.isCampgroundAuthorized, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            req.flash("error", "Campground not found")
            res.redirect("back")
        } else {
            res.render("./campgrounds/editcamp", {camp: camp});
        }
    })

})

//UPDATE ROUTE
router.put("/:id", middleware.isCampgroundAuthorized, function(req, res){
    var campground = req.body.camp;
    Campground.findByIdAndUpdate(req.params.id, campground, function(err){
        req.flash("success", "Campground edited")
        res.redirect(`/campgrounds/${req.params.id}`)
    })
})

//DELETE ROUTE
router.delete("/:id", middleware.isCampgroundAuthorized, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err, camp){
        if(err){
            req.flash("error", "Failed to delete campground")
            res.redirect("back")
        } else {
            // still returns camp here
            camp.comments.forEach(function(id){
                Comments.findByIdAndDelete(id, function(err){
                    if(err){
                        req.flash("error", "Failed to delete campground's comments")
                        res.redirect("back")
                    } else {
                        return;
                    }
                })
            });
            req.flash("success", "Campground deleted")
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;