const mongoose = require("mongoose");
const nodemailer = require("nodemailer");


const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});

const connectTransporter = require("../config/nodemailer");

//post middleware
fileSchema.post("save", async function(doc){
    try{
        console.log("DOC->", doc);

        //TRANSPORTER
        let transporter = connectTransporter();

        //send mail
        let info = await transporter.sendMail({
            from: `Utkarsh Mishra`,
            to: doc.email,
            subject: "New File Uploaded on Cloudinary by FileUploader Project",
            html: `<h2>Hello ${doc.name} </h2> 
            <p>File has been successfully Uploaded View here: <a href="${doc.imageUrl}">${doc.imageUrl}</a></p>`,
        });

        console.log("INFO->",info); 
    }
    catch(error){
        console.error(error);
    }
})


module.exports = mongoose.model("File", fileSchema);