// console.log("Hello aditi");
//REQUIRE EXPRESS, CREATE INSTANCE & LISTEN & USE IT...

const express = require("express"); //first will require/need express
require("./config/database")
const {isValidUserAdminAuth, isValidUser}  = require("./middlewares/auth")
const app = express();// create instance type / our server from express.
const connectDB= require("./config/database")
const User = require("./models/user")

app.use(express.json())// IMP @ : MIDDLEWARE : CONVERT INCOMING REQUEST'S JSON INTO THE JS OBJECT.

//post api for sign up of user....
app.post("/signup",async (req,res)=>{
    //Create a new instance of user model ###
    // const user = new User({
    //     firstName: "AditiR",
    //     lastName: "Joshi",
    //     emailId: "aj@gmail.com",
    //     password:"aj@123"
    // })
    const user = new User(req.body);//Dyanmic from the body row json taking the data and storing in the db.

    //ALL DB operation like saving data, reading data we need to wrap inside the try catch block... IMP :)
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Some error occured." +  err.message);
    }
})

//API : to get user by email:
app.get("/userViaEmail",async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId:userEmail});//findOne also method present which gives only one record from array of records which gets found.
        if(users.length===0){
            res.status(400).send("User not found");
        }
        else{

            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({});//EMPTY FILTER THEN IT GIVES ALL THE RECORD PRESENT IN THAT MODEL.
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

// app.get("/userById",async (req,res)=>{
//     try{
//         const id = req.query._id;
//         const user = await User.findById(id);
//         res.send(user)
//     }
//     catch(err){
//         res.status(400).send("Something went wrong")
//     }
// })

//better version...
app.get("/userById", async (req, res) => {
    try {
        const id = req.query._id;

        if (!id) {
            return res.status(400).send("ID is required");
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

// app.get("/userById/:id", async (req, res) => { params way...
//     const user = await User.findById(req.params.id);
// });


app.use("/test",(req,res)=>{
    res.send("hello from the server");
})
app.use("/aditi",(req,res)=>{
    res.send("aditi's port")
})

//get, post, delete requests : use matches every http method, get post delete are method specific.

// app.use("/user", (req, res) => {
//  res.send("HAHAHAHAHAHA");
// });
// when a request like /user , /user/1 , or /user/profile comes in,
// it gets caught by this app.use() handler before Express ever reaches your
// app.get("/user") , app.post("/user") , or app.delete("/user") routes.
//SO IMP .... you should always place your specific routes before the generic ones


app.get("/user",(req,res)=>{
    console.log("here", req.query) //QUERY PARAMS how & when used search type.... IMP REM...
    res.send({"FirstName":"Aditi","LastName":"Joshi"})
})

app.get("/user/:name/:password",(req,res)=>{//DYNAMIC ROUTING how & when used particular smeid..,... IMP REM..
    console.log("value",req.params);
    res.send("dynamic routing");
})

app.post("/user",(req,res)=>{
    res.send("data sent sucessfully");
})

app.delete("/user",(req,res)=>{
    res.send("deleted user sucessfully");
})

//EP: 5 MIDDELWARES & ERROR HANDLING
app.use("/new",(req,res,next)=>{
    console.log("In first route handler")
    // res.send("namaste")
    next();//NEXT IN EXPRESS IS USED TO GO ON NEXT ROUTE HANDLE ...next() = "I'm done, pass control to the next middleware or route"
// Without it — your request just freezes.
},
[(req,res,next)=>{
    console.log("in 2nd route handler")
    // res.send("response got from 2nd route handler")
    next()
},(req,res,next)=>{
    console.log("in 3rd route handler")
    res.send("hello finally")
    next()
}])

// WHY THIS NEXT AND ALL NEEDED? I CAN HAVE ONE WHICH HANDLE ALL NoOO.. Why multiple functions this that array and all??? => EG. Authorization types code requires this type of middlewares...

// THIS FUNCTION WHICH U PUT IN MIDDLE ARE CALLED AS MILDDLEWARES... All the functions which it goes through in between are called as middlewares...
// & the final return response is a request handler..

// ADITI: Middleware is a function which runs between req & res.
// needed bcz we don't want to repeat the same code in every route.

//CODE EXAMPLE : Handle auth middleware for all get post requests...
app.use("/admin",isValidUserAdminAuth)

app.get("/admin/getAllData",(req,res,next)=>{
    res.send("All data sent");
})

app.get("/admin/deleteData",(req,res,next)=>{
    res.send("Data deleted");
})

app.use("/usermy/login",(req,res)=>{
    res.send("logged in")
})
// app.use("/usermy/login",(res)=>{ // ERROR BCZ 3 ARGUEMENTS PLACES ARE FIXED... SO RES xx FIRST...
//     res.send("logged in")
// })

app.use("/usermy/viewdata",isValidUser,(req,res,next)=>{
res.send("yes correct user")
})

//ERROR HANDLING : 1. try catch block 2. wild card error handling

app.use("/here",(req,res)=>{
    //db logic or logic of route handling.
    try{
        throw new error("Some error occured")
        res.send("inside here")
}catch(err){
        res.status(500).send("Something went wrong...")
    }
})

//wild card error handling: 
app.use("/",(err,req,res,next)=>{//remember the order of req,res that added needed to be as per rules.
    if(err){
        res.status(500).send("Error occured");
    }
})

// app.use("/",(req,res)=>{ //GENERIC TYPE OF LAST ROUTE HANDLER IF ABOVE NO BODY TYPE HANDLE THEN THIS COULD BE USED.
//     res.send("/// from here")
// })


// app.get("/a(bc)+d", (req, res) => {
//  res.send({ firstName: "Aditi", lastName: "Joshi" });
// }); 
// was valid in Express versions using path-to-regexp version 6 or below,
// which includes roughly Express 4.x and early 5.x alpha releases.

connectDB().then(() => {
    console.log("Db connected successfully")
    app.listen(3000,()=>{
    console.log("hello aditi listening on port 3000...")
}); // THIS WILL START LISTING ON PORT 3000. WE CAN SEND REQUEST TO OUR SERVER NOW.
}).catch((err) => {
    console.log("Db connection failed.", err)
});


