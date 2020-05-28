var router = require("express").Router({mergeParams: true}); //mergeParams is to merge the req.params to its parent (campgrounds)
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware"); //index.js is automaticallly referenced here

//New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if(err || !camp){
            req.flash("error", "Campground not found")
            res.redirect("back")
        } else {
            res.render("./comments/addcomment", {camp: camp})
        }
    })  
})

//Create Route
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if(err || !camp){
            req.flash("error", "Campground not found")
            res.redirect("back")
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Failed to create comment")
                    res.redirect("back")
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect(`/campgrounds/${req.params.id}`)
                }
            })
        }
    })
})

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.isCommentAuthorized, function(req, res){
    var idCamp = req.params.id;
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            req.flash("error", "Comment not found")
            res.redirect("back")
        } else {
            res.render("./comments/editcomment", {comment: comment, idCamp: idCamp});
        }
    })
})

//UPDATE ROUTE
router.put("/:comment_id", middleware.isCommentAuthorized, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        res.redirect(`/campgrounds/${req.params.id}`)
    })
})

//DELETE ROUTE
router.delete("/:comment_id", middleware.isCommentAuthorized, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Failed to delete comment")
            res.redirect("back")
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})


module.exports = router;