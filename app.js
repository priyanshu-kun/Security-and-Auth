require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Level 3 security quite much secure
// const md5 = require("md5");

// level 4 security much secure
const bcrypt = require("bcrypt");
// number of salt round
const saltRound = 12;

// level 2 security but not much secure
// const encrypt = require("mongoose-encryption");



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", 'ejs');



mongoose.connect("mongodb://localhost:27017/UsersDB", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log("Your database created sucessfully!");
    }
    else {
        console.error("Somthing bad is happen try again!");
    }
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// Use level 2 security
// UserSchema.plugin(encrypt, { secret: process.env.MY_SECRET ,encryptedFields: ['password']});



const User = mongoose.model("User", UserSchema);




app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRound, (err, hash) => {
        if (!err) {

            const newUser = new User({
                email: req.body.username,
                // turn password in irrevesable string using md5 function
                // password: md5(req.body.password)
                password: hash
            });
            newUser.save((err) => {
                if (!err) {
                    res.render("secrets")
                }
                else {
                    console.error("Something bad is happen please try again!", err);
                }
            })
        }
        else {
            console.error("Somthing bad is happen please try again your error: ",err);
        }
    })

})

app.post("/login", (req, res) => {
    const username_ = req.body.username;
    // convert user login passward in md5 password and compare both encrypted password to check is that valid user or not.
    // const password = md5(req.body.password);

    const password = req.body.password;
    User.findOne({ email: username_ }, (err, doc) => {
        if (err) {
            console.error("Your are not a valid user!");
        }
        if (doc) {
            bcrypt.compare(password,doc.password,(err,result) => {
                if(result) {
                    res.render("secrets");
                }
                else {
                    console.log("User not found!");
                }
            })
        }
    })
});




app.listen(3000, (err) => {
    if (!err) {
        console.log("Server is running on port 3000");
    }
    else {
        console.error("An unexpected error occur", err);
    }
})