// console.log("Hello aditi");
//REQUIRE EXPRESS, CREATE INSTANCE & LISTEN & USE IT...

const express = require("express"); //first will require/need express
const app = express();// create instance type / our server from express.

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

app.use("/",(req,res)=>{
    res.send("/// from here")
})

// app.get("/a(bc)+d", (req, res) => {
//  res.send({ firstName: "Aditi", lastName: "Joshi" });
// }); 
// was valid in Express versions using path-to-regexp version 6 or below,
// which includes roughly Express 4.x and early 5.x alpha releases.

app.listen(3000,()=>{
    console.log("hello aditi listening on port 3000...")
}); // THIS WILL START LISTING ON PORT 3000. WE CAN SEND REQUEST TO OUR SERVER NOW.
