const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.set("view engine",'ejs');



mongoose.connect("mongodb://localhost:27017/UsersDB",{useNewUrlParser: true,useUnifiedTopology: true},(err) =>{
    if(!err) {
        console.log("Your database created sucessfully!");
    }
    else {
        console.error("Somthing bad is happen try again!");
    }
})

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const User =  mongoose.model("User",UserSchema);


app.get("/",(req,res) => {
    res.render("home");
})
app.get("/login",(req,res) => {
    res.render("login");
})
app.get("/register",(req,res) => {
    res.render("register");
})

app.post("/register",(req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if(!err) {
            res.render("secrets")
        }
        else {
            console.error("Something bad is happen please try again!",err);
        }
    })
})

app.post("/login",(req,res) => {
    const username_ = req.body.username;
    const password = req.body.password;
    User.findOne({email: username_},(err,doc) => {
        if(err) {
            console.error("Your are not a valid user!");
            
        }
        if(doc) {
           if(doc.password === password) {
            res.render("secrets");
           } 
        }
    })
});


app.listen(3000,(err) => {
    if(!err) {
        console.log("Server is running on port 3000");
    }
    else {
        console.error("An unexpected error occur",err);
    }
})