const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isValidUserAdminAuth = (req,res,next)=>{//get post all actions realted to admin would be first checked here for user valid or no... then particular route handler will get called.
    const user = "aditi";
    const isValidUser = user==="aditi";
    if(isValidUser){
        console.log("You can proceed");
        next()
    }else{
        res.status(401).send("You are not valid user");
    }
}

const isValidUser = (req,res,next)=>{//get post all actions realted to admin would be first checked here for user valid or no... then particular route handler will get called.
    const user = "user1";
    const isValidUser = user==="user1";
    if(isValidUser){
        console.log("You can proceed");
        next()
    }else{
        res.status(401).send("You are not valid user");
    }
}

const userAuth = async (req,res,next)=>{
    // in this will validate the user with the jwt token.
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error ("Token Not valid.");
        }

        const decodedPart = jwt.verify(token,"DEV@joshi24");
        const {_id} = decodedPart;

        const user = await User.findOne({_id:_id});
        if(!user){throw new Error("User not found.")}
        req.user= user;
        next();
    }
    catch(err){
        res.status(400).send("Something Went wrong " + err.message);
    }
}

module.exports = {
    isValidUserAdminAuth,
    isValidUser,
    userAuth
}