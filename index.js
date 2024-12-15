const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cookieParse = require("cookie-parser");
const { render } = require("ejs");

const userRouter = require('./routes/user');
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e)=> console.log("MongoDB Connected"));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))

app.get("/", (req, res)=>{
    res.render("home", {
        user: req.user,
    });
});

app.use("/user", userRouter);

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));