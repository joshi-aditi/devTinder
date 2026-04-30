//databse level/schema level ip santization & api level ip data santization...
const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// Validators = check data
// Sanitizers = clean data

//Schema create then model create

//SCHEMA.
//schema level ip santization: ON EACH FIELD IMP...  email, password, photourl will validate with npm validator...
const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        // match: /^[A-Za-z]{2,}$/ // in case of at least like 2 char of a-z should be present.
        match: /^[A-Za-z]+$/ //atleast one char of a to z of should be present.
    },
    lastName:{
        type: String,
        match: /^[A-Za-z]*$/,
        trim: true
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Email is not valid.")
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong.")
            }
        }
    },
    age:{
        type: Number,
        min: 18,
        max: 100
    },
    gender:{
        type:String,
        validate(value){ //This would work on create to ensure it works on patch also we need to add option in patch api for validators.
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },
    about : {
        type: String,
        default: "This is about section.",
        maxLength: 200
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length>10){
                throw new Error("Skills cannot exceed 10")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("PhotoUrl is not correct.")
            }
        }
    }
},{
    timestamps: true
});

userSchema.methods.getJwt = function(){
    const user = this;
    return jwt.sign({_id:user._id},"DEV@joshi24",{ expiresIn: "7d" });
}

userSchema.methods.comparePassword  = async function(passwordInputByUser){
    const user = this;
    const passwordHash = await bcrypt.compare(passwordInputByUser,user.password)
    return passwordHash;
}


//MODEL
const User = mongoose.model("User",userSchema);//MODEL NAME ALWAYS START WITH CAPITAL LETTER.
module.exports = User;