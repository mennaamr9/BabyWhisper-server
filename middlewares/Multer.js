const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
    console.log("Original name:", file.originalname);
    console.log("MIME type:", file.mimetype);
    console.log("Extension:", path.extname(file.originalname).toLowerCase());

    const allowedExtensions = /jpeg|jpg|png|mp3|wav|m4a|ogg|txt|md|webm/;
    const allowedMimeTypes = [
         "audio/mpeg",       
         "audio/wav", 
         "audio/wave",       
         "audio/x-wav", 
         "audio/webm",                          
         "audio/mp4",                                    
         "audio/m4a",
         "audio/x-m4a",
         "audio/ogg",                            
         "application/octet-stream", 
         "image/jpeg", "image/png",
         "text/plain", "text/markdown"
     ];

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only supported image, audio, or text files are allowed!"));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

module.exports = upload;

