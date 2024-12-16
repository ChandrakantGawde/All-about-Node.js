const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cookieParse = require("cookie-parser");
const { render } = require("ejs");

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e)=> console.log("MongoDB Connected"));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token')); // genric middleware that check the token for all request 

app.get("/", (req, res)=>{
    res.render("home", {
        user: req.user,
    });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));