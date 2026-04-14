const mongoose = require("mongoose")

//Schema create then model create

//SCHEMA.
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type:String
    },
    passwrod:{
        type:String
    },
    age:{
        type: String
    },
    gender:{
        type:String
    }
});


//MODEL
const User = mongoose.model("User",userSchema);//MODEL NAME ALWAYS START WITH CAPITAL LETTER.
module.exports = User;