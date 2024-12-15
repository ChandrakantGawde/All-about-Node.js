const {createHmac, randomBytes} = require("node:crypto"); // Place this at the top of the file, outside of any function
const {Schema, model} = require("mongoose");
const { createTokenForUser } = require("../services/authentication");
const { use } = require("../routes/user");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    salt: {   // salt use for encrypt the password salt is like secret key
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/default.svg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {timestamps: true});

// use for crypting the password - crypto hash node js
// before the user saves, this function runs and hashes the password
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString(); // generate new salt for each user
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenrateToken',  async function(email, password){
    const user = await this.findOne({email});
    console.log(user);
    if(!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");
    
    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect password");
    
    const token = createTokenForUser(user);
    return token;
})   

const User = model("user", userSchema);
module.exports = User;
