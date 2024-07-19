const cloudinary = require("cloudinary").v2;

exports.Uploadmedia = async(file,folder)=>{
    try {
        
        const options = {folder};
        options.resource_type = "auto"
        return await cloudinary.uploader.upload(file.tempFilePath,options);

    } catch (error) {
        console.log("error while uploading media",error);
        
    }
}