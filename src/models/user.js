//databse level/schema level ip santization & api level ip data santization...
const mongoose = require("mongoose")

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
        trim: true
    },
    password:{
        type:String,
        required: true
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
        default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
    }
},{
    timestamps: true
});


//MODEL
const User = mongoose.model("User",userSchema);//MODEL NAME ALWAYS START WITH CAPITAL LETTER.
module.exports = User;