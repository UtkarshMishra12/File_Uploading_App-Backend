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

async function uploadFileToCloudinary(file,folder, quality){
    const options = {folder};
    console.log("Temp Path->", file.tempFilePath);
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
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

function isLargeFile(fileSize) {
    // converting bytes ito megabytes
    const mbSize = fileSize / (1024 * 1024);
    console.log("filesize is --> ", mbSize);
    return mbSize > 5;
}

//Video upload
exports.videoUpload = async (req,res) =>{
    try{
        //fetch data
        const {name,tags,email} = req.body;
        console.log(email,name,tags);

        const file = req.files.videoFile;
        // console.log(videoFile);

        //validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("FileTYPE->",fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"Video File Type Not Supported",
            });
        }

         // add a upper limit of 5MB for Video
         const fileSize = file.size;
         if(isLargeFile(fileSize)){
             return res.status(400).json({
                 success: false,
                 message: 'Files greater than 5mb are not supported'
             })
         }

        //upload to cloudinary
        console.log("Uploading to Cloudinary");

        const response = await uploadFileToCloudinary(file, "Utkarsh");
        console.log(response);

        //Save Entry in DB
        const fileData= await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });
        
        
        //response
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Video Successfully Uploaded",
        });

    }
    catch(error){
        res.status(400).json({
            success:"false",
            message:"Something went wrong in uploading video "
        })
    }
}


//imageSizeReducer
exports.imageSizeReducer = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }


        //file format and size are supported
        console.log("Uploading to Cloudinary");

        //COMPRESS using width and height - options = {width: 800, height: 600}
        //compressing using quality property of options objects
        const response = await uploadFileToCloudinary(file, "Utkarsh", 80);
        console.log(response);

        // Saving Entry in DB
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};