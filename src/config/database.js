require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");//Added given below for the error it was not getting connecting... 
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    await mongoose.connect(
        process.env.MONGO_URI
    )
}

//connect db should be done before listening on the server so we call this connectdb before we do app.listen on the server.
module.exports = connectDB;

// connectDB().then(() => {
//     console.log("Db connected successfully")
// }).catch((err) => {
//     console.log("Db connection failed.", err)
// });