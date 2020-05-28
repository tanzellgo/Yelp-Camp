var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    price: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Campground", campgroundSchema); //"Campground" is and pluralized for the collection name; additionally this line of code adds a model methods 