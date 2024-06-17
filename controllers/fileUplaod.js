const File = require("../models/File");
const cloudinary = require("cloudinary").v2;


//localFileHandler = Client data-> store it into server
exports.localFileUpload = async (req,res) =>{
    try{
        //fetch file from req
        const file = req.files.file;
        console.log("File", file);

        //define path where file needs to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("File pATH->", path);

        //add path to the move function
        file.mv(path, (err)=>{
            console.log(err);
        });
         
        //create a successfull response
        res.json({
            success:true,
            message: "Local File uploaded successfully",
        });
    }
    catch(error){
        console.log(error);
    }
}


//imageUpload controller
function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder){
    const options = {folder};
    return await cloudinary.uploader.upload(file.tempFilePath,options );
} 

exports.imageUpload = async (req,res) =>{
    try{
        //fetch data
        const {email, tags, name} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);
 
        //validation
        const supportedTypes = ["jpeg", "jpg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("FileType->", fileType); 

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:  "File format not supported",
            });
        }

        //file format supported
        //Now upload to the cloudinary
        const response = await uploadFileToCloudinary(file, "Utkarsh");
        console.log(response);

        //save entry in DB
        const fileData= await File.create({
            name,
            email,
            tags,
            imageUrl: response.secure_url,
        })

        res.status(200).json({
            success:true,
            imageUrl : response.secure_url,
            message:"Image uploaded to cloudinary successfully",
        })

    }
    catch(error){
        res.status(400).json({
            success:"false",
            message:"Something went wrong in uploading image "
        })
    }
}
