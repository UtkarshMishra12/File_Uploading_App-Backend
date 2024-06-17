//app create
const express = require("express");
const app = express();

//PORT
require("dotenv").config();
const PORT = process.env.PORT || 400;

//add middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
})); //This upload the file on the server


//connect with db
const dbConnect = require("./config/database");
dbConnect();

//connect with cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//mount api route
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

//activate server
app.listen(PORT, () =>{
    console.log("Server started successfully at PORT");
})

//default route
app.get("/", (req,res) =>{
    res.send(`<h1> Home Page</h1>`);
})
