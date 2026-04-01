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

module.exports = {
    isValidUserAdminAuth,
    isValidUser
}