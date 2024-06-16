const File = require("../models/File");


//localFileHandler = Client data-> store it into server
exports.localFileUpload = async (req,res) =>{
    try{
        //fetch file from req
        const file = req.files.file;
        console.log("File", file);

        //create path where file needs to be stored on server
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
