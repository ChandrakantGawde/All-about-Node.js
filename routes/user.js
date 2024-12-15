const {Router} = require("express");
const User = require("../models/user");

const router = Router();

// not use controller write all code in this file
router.get('/signin', (req, res)=> {
    return res.render("signin");
});

router.get('/signup', (req, res)=> {
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log( email, password)
    try {
        const token = await User.matchPasswordAndGenrateToken(email, password);
        console.log(token)
        return res.cookie('token', token).redirect("/");
    } catch (error) {
        return res.render("signin" , {
            error: "Incorrect Email or Password",
        })
    }
});

router.post("/signup", async (req, res)=> {
    const { fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});

module.exports = router;