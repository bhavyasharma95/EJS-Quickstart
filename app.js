const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { ppid } = require("process");

const app = express()

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/toxicDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// routes

app.route("/")
.get(function(req,res){
    res.render("home")
})

app.route("/login")
.get(function(req,res){
    res.render("login")
})

app.route("/signup")
.get(function(req,res){
    res.render("signup")
})

app.route("/compose")
.get(function(req,res){
    res.render("compose")
})

app.route("/community")
.get(function(req,res){
    res.render("community")
})

//listen

app.listen(3000, function(){
    console.log("Huston, this is node speaking!!!")
})