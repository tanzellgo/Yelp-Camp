var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var passport = require("passport"); //isAuthenticated in isLoggedin is from passport
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("error", "Please Log-in First")
        res.redirect("/login")
    }
}

middlewareObj.isCampgroundAuthorized = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp){
            //user might change the param with the same length of characters and camp not being found
            if(err || !camp){
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                // use .equals not === beacuse camp.author.id may seem like a string but it is an object
                if(camp.author.id.equals(req.user._id)){ 
                    next();
                } else {
                    req.flash("error", "Your not authorized to do that!")
                    res.redirect("back") // special keyword return back to the previous page
                }
            }
        })
    } else {
        req.flash("error", "Please Log-in First")
        res.redirect("/login")
    }
}


middlewareObj.isCommentAuthorized = function(req, res, next){
    if(req.isAuthenticated()){

        Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
            if(err || !camp){
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                Comment.findById(req.params.comment_id, function(err, comment){
                    if(err || !comment){
                        req.flash("error", "Comment not found")
                        res.redirect("back")
                    } else {
                        // use .equals not === beacuse camp.author.id may seem like a string but it is an object
                        if(comment.author.id.equals(req.user._id)){ 
                            next();
                        } else {
                            req.flash("error", "Your not authorized to do that!")
                            res.redirect("back") // special keyword return back to the previous page
                        }
                    }
                })
            }
        })

    } else {
        req.flash("error", "Please Log-in First")
        res.redirect("/login")
    }
}

module.exports = middlewareObj;