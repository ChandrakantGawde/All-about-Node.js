const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){      // use genric function parameter passed from outside 
    console.log("cookieName", cookieName)               // return result
    return (req, res, next)=> {
        const tokenCookieValue = req.cookies[cookieName]; // cookie parser

        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue)
            req.user = userPayload;
        } catch (error){}

        return next();
    };
}

module.exports ={
    checkForAuthenticationCookie,
}