// console.log("Hello aditi");
//REQUIRE EXPRESS, CREATE INSTANCE & USE IT...

const express = require("express"); //first will require/need express
const app = express();// create instance type / our server from express.

app.use("/test",(req,res)=>{
    res.send("hello from the server");
})
app.use("/aditi",(req,res)=>{
    res.send("aditi's port")
})

app.use("/",(req,res)=>{
    res.send("/// from here")
})

app.listen(3000,()=>{
    console.log("hello aditi listening on port 3000...")
}); // THIS WILL START LISTING ON PORT 3000. WE CAN SEND REQUEST TO OUR SERVER NOW.
