require("dotenv").config();

const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cookieParse = require("cookie-parser");
const { render } = require("ejs");
const Blog = require("./models/blog");
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;   // while diployeeing the project use env file 

mongoose.connect(process.env.MONGO_URL).then((e)=> console.log("MongoDB Connected"));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token')); // genric middleware that check the token for all request 
app.use(express.static(path.resolve("./public"))) // get satically image from public folder

app.get("/", async (req, res)=>{
    const allBlog = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlog
    });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));