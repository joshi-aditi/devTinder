// console.log("Hello aditi");
//REQUIRE EXPRESS, CREATE INSTANCE & LISTEN & USE IT...

const express = require("express"); //first will require/need express
require("./config/database")
const { isValidUserAdminAuth, isValidUser, userAuth} = require("./middlewares/auth")
const app = express();// create instance type / our server from express.
const connectDB = require("./config/database")
const User = require("./models/user")
const {validateReqData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json())// IMP @ : MIDDLEWARE : CONVERT INCOMING REQUEST'S JSON INTO THE JS OBJECT.
app.use(cookieParser());//Direct in req we can't get the cookie we need to parse it so that in req of other api we can get that token from cookie...

//post api for sign up of user....
app.post("/signup", async (req, res) => {
    //Create a new instance of user model ###
    // const user = new User({
    //     firstName: "AditiR",
    //     lastName: "Joshi",
    //     emailId: "aj@gmail.com",
    //     password:"aj@123"
    // })

    //ALL DB operation like saving data, reading data we need to wrap inside the try catch block... IMP :)
    try {
        //IN SIGNUP ONLY REQUIRED 4 FILEDS TYPE SHOULD ONLY BE PASSED AND TAKEN FROM USER OTHER ANY NO NEED.
        // const allowedFieldsAre = ["firstName", "lastName", "emailId", "password"];
        // if (!req.body || Object.keys(req.body).length === 0) {
        //     throw new Error("Request body cannot be empty");
        // }
        // const allowedFieldsData = Object.keys(req.body).every((key) => {
        //     return allowedFieldsAre.includes(key)
        // })
        // if (!allowedFieldsData) { throw new Error("Given fields are not correct"); }

        //1. VALIDATE THE DATA OF REQ BODY.
        validateReqData(req);

        //2. ENCRYPT THE PASSWORD AND STORE THAT AS USER....
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        
        const user = new User({ //with this only the given fields will go no other key value which ever extra given..
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });//Dyanmic from the body row json taking the data and storing in the db. NEVER DIRECTLY PASS THE REQ.BODY IN SAVE ...
        await user.save();
        res.send("User added successfully");
    }
    catch (err) {
        res.status(400).send("Some error occured." + err.message);
    }
})

app.post("/login", async (req,res)=>{
    // emailid and password user adds then will validate both of that and then logini the user successfully.
    try{
        const {emailId,password} = req.body;

        const user = await User.findOne({emailId:emailId});
        if(!user) {throw new Error("Invalid Credentials.");}

        const isPasswordValid = await user.comparePassword (password);
        if(!isPasswordValid) {throw new Error ("Invalid Credentials.");}

        //EMAIL AND PASSWORD VALIDATED NOW WILL CREATE JWT TOKEN AND STORE IN COKKIE AND PASS THAT.
        
        //JWT STEPS:
        
        //1. Create a jwt token
        const token = user.getJwt(); //TOKEN : expiresIn @... 7day.

        //2. add the token to cookie & send response.
        res.cookie("token",token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})//Cookies: expires @... 7day, for 8hr = 8*3600000
        res.send("Login successfully")
    }catch (err) {
        res.status(400).send("Some error occured " + err.message);
    }

})

app.get("/profile", userAuth, async (req,res)=>{
    try{
        //THIS ALL WOULD NOW BE HANDLED VIA MIDDLEWARE.
        // const {token} = req.cookies;
        // if(!token){
        //     throw new Error ("Invalid token");
        // }
        // const decodedMsg = jwt.verify(token,"DEV@joshi24");
        // const user = await User.findOne({_id: decodedMsg._id})
        // if(!user){throw new Error ("User not found");}
        res.send("got profile of: " + req.user.firstName);
    }
    catch (err) {
        res.status(400).send("Some error occured " + err.message);
    }
})

//API : to get user by email:
app.get("/userViaEmail", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });//findOne also method present which gives only one record from array of records which gets found.
        if (users.length === 0) {
            res.status(400).send("User not found");
        }
        else {

            res.send(users);
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.post("/sendConnectionRequest",userAuth, (req,res,next)=>{
    //here in req.user we get the user from the middleware.
    res.send(req.user.firstName + " Sent connection request.");
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});//EMPTY FILTER THEN IT GIVES ALL THE RECORD PRESENT IN THAT MODEL.
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.get("/userById", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findById(userId);
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
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

//delete api: delete a user by id...
app.delete("/userById", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User delete successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})

app.delete("/userByEmail", async (req, res) => {
    const userEmail = req.body.emailId;//THE body passed key name should match with the schema key name... 
    try {
        const user = await User.findOneAndDelete({ emailId: userEmail });
        res.send("User delete successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

//Update User api (condition, update, options): ** diff between put and patch. 
app.patch("/userById/:userId", async (req, res) => {
    //updating given id user. WITH ENSURING THAT ONLY ALLOWED FIELDS ARE UPDATED AND NOT THE FIELDS WHICH ARE NOT ALLOWED TO UPDATE ONCE ADDED.
    try {
        const userId = req.params.userId;
        const allowedFieldsAre = ["password", "age", "about", "skills", "photoUrl"];
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error("Request body cannot be empty");
        }
        const isUpdateAllowed = Object.keys(req.body).every((key) => {
            return allowedFieldsAre.includes(key);
        })
        if (!isUpdateAllowed) {
            throw new Error("Given fields are not valid to be updated.")
        }
        const data = req.body;
        // const user = await User.findByIdAndUpdate(userId,{emailId:"nehajoshi@gmail.com"});
        const user = await User.findByIdAndUpdate(userId, data, { lean: true, runValidators: true });
        res.send("User updated successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message)
    }
})

//update via email id:
app.patch("/userByEmail/:userEmail", async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const allowedFieldsAre = ["password", "age", "about", "skills", "photoUrl"];
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error("Request body cannot be empty");
        }
        const isUpdateAllowed = Object.keys(req.body).every((key) => {
            return allowedFieldsAre.includes(key);
        })
        if (!isUpdateAllowed) {
            throw new Error("Given fields are not valid to be updated.")
        }
        const data = req.body;
        const user = await User.findOneAndUpdate({ emailId: userEmail }, data, { new: true, upsert: false, runValidators: true });//new returns updated data, if upsert create if no user found then it creates new and add in that..
        if (!user) {
            return res.status(404).send("User not found"); // ✅ FIX wrong email addded then to success bcz this case was not handled. @IMP..
        }
        res.send("User updated successfully")
    }
    catch (err) {
        res.status(400).send("Something went wrong "+ err.message);
    }
})



app.use("/test", (req, res) => {
    res.send("hello from the server");
})
app.use("/aditi", (req, res) => {
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


app.get("/user", (req, res) => {
    console.log("here", req.query) //QUERY PARAMS how & when used search type.... IMP REM...
    res.send({ "FirstName": "Aditi", "LastName": "Joshi" })
})

app.get("/user/:name/:password", (req, res) => {//DYNAMIC ROUTING how & when used particular smeid..,... IMP REM..
    console.log("value", req.params);
    res.send("dynamic routing");
})

app.post("/user", (req, res) => {
    res.send("data sent sucessfully");
})

app.delete("/user", (req, res) => {
    res.send("deleted user sucessfully");
})

//EP: 5 MIDDELWARES & ERROR HANDLING
app.use("/new", (req, res, next) => {
    console.log("In first route handler")
    // res.send("namaste")
    next();//NEXT IN EXPRESS IS USED TO GO ON NEXT ROUTE HANDLE ...next() = "I'm done, pass control to the next middleware or route"
    // Without it — your request just freezes.
},
    [(req, res, next) => {
        console.log("in 2nd route handler")
        // res.send("response got from 2nd route handler")
        next()
    }, (req, res, next) => {
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
app.use("/admin", isValidUserAdminAuth)

app.get("/admin/getAllData", (req, res, next) => {
    res.send("All data sent");
})

app.get("/admin/deleteData", (req, res, next) => {
    res.send("Data deleted");
})

app.use("/usermy/login", (req, res) => {
    res.send("logged in")
})
// app.use("/usermy/login",(res)=>{ // ERROR BCZ 3 ARGUEMENTS PLACES ARE FIXED... SO RES xx FIRST...
//     res.send("logged in")
// })

app.use("/usermy/viewdata", isValidUser, (req, res, next) => {
    res.send("yes correct user")
})

//ERROR HANDLING : 1. try catch block 2. wild card error handling

app.use("/here", (req, res) => {
    //db logic or logic of route handling.
    try {
        throw new error("Some error occured")
        res.send("inside here")
    } catch (err) {
        res.status(500).send("Something went wrong...")
    }
})

//wild card error handling: 
app.use("/", (err, req, res, next) => {//remember the order of req,res that added needed to be as per rules.
    if (err) {
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
    app.listen(3000, () => {
        console.log("hello aditi listening on port 3000...")
    }); // THIS WILL START LISTING ON PORT 3000. WE CAN SEND REQUEST TO OUR SERVER NOW.
}).catch((err) => {
    console.log("Db connection failed.", err)
});


