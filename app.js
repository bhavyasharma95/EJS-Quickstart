const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express()

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: 'Flymetothemoon',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/toxicDB", {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const toxicSchema = new mongoose.Schema({
    title: String,
    body: String,
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema)
const Toxic = new mongoose.model("Toxic", toxicSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes

app.route("/")
.get(function(req,res){
    Toxic.find({}, function(err, found){
        res.render("home",{
            posts: found,
        })
    })
});

app.route("/compose")
.get(function(req,res){
    if(req.isAuthenticated()){
        res.render("compose",{
            title: "Be Toxic"
        })
    }else{
        res.redirect("/login")
    }
})
.post(function(req,res){
    const toxic = new Toxic({
        title:req.body.postTitle,
        body:req.body.postContent,
    })
    toxic.save()
    res.redirect("/")
});

app.route("/community")
.get(function(req,res){
    if(req.isAuthenticated()){
        res.render("community")
    }else{
        res.redirect("/login")
    }
});

app.route("/login")
.get(function(req,res){
    res.render("login")
})
.post(function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err){
        if(!err){
            passport.authenticate("local")(req,res, function(){
                res.redirect("/compose");
            })
        }
    })
});

app.route("/signup")
.get(function(req,res){
    res.render("signup")
})
.post(function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log("Please, try again...");
            res.redirect("/signup")
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/compose");
            })
        }
    })
});

app.route("/logout")
.get(function(req,res){
    req.logOut();
    res.redirect("/");
});


app.route("/toxic/:id")
.get(function(req,res){
    const route = req.params.id;

    Toxic.findOne({_id: route}, function(err, foundPost){
        if(!err){
            res.render("blog",{
                heading: foundPost.title,
                content: foundPost.body,
            })
        }else{
            console.log("what the fuck!!")
        }
    })
})

//listen

app.listen(3000, function(){
    console.log("Huston, this is node speaking!!!")
})