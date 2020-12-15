"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var ejs = require("ejs");

var mongoose = require("mongoose");

var aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"]("public"));
mongoose.connect("mongodb+srv://admin:admin@blogdb.9vdcr.mongodb.net/blogDb?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var postSchema = {
  name: String,
  content: String
};
var Post = mongoose.model("Post", postSchema);
app.get("/", function (req, res) {
  Post.find({}, function (err, foundPosts) {
    res.render("home", {
      posts: foundPosts
    });
  });
});
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
app.get("/contact", function (req, res) {
  res.render("contact");
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  var post = new Post({
    name: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
app.get("/posts/:postId", function (req, res) {
  var requestedPostId = req.params.postId;
  Post.findOne({
    _id: requestedPostId
  }, function (err, foundId) {
    if (!err) {
      res.render("post", {
        title: foundId.name,
        content: foundId.content,
        postId: foundId._id
      });
    }
  });
}); //admin can delete posts that are not appropriate

app.get("/posts/:postId/delete", function (req, res) {
  var requestedPostId = req.params.postId;
  Post.findByIdAndDelete(requestedPostId).exec();
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});