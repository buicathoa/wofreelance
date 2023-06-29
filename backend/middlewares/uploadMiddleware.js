const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadFiles = (folder) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     allowedFormats: [
//       "jpg",
//       "png",
//       "pdf",
//       "docx",
//       "mp3",
//       "mp4",
//       "gif",
//       "flv",
//       "avi",
//       "xlsx",
//       "jpg",
//       "jpeg"
//     ],
//     filename: function (req, file, module, cb) {
//       req.body.file = file.originalname
//       cb(null, file.originalname);
//     },
//     params: {
//       folder: (req, file) => req.body.folder,
//       public_id: (req, file) => file.originalname,
//     },
//   });
  
//   const upload = multer({
//     storage: storage,
//     limits: 1024 * 1024 * 5
//   }) ;
  
//   return upload
// }
// module.exports = uploadFiles;

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: [
    "jpg",
    "png",
    "pdf",
    "docx",
    "mp3",
    "mp4",
    "gif",
    "flv",
    "avi",
    "xlsx",
    "jpg",
    "jpeg"
  ],
  filename: function (req, file, module, cb) {
    req.body.file = file.originalname
    cb(null, file.originalname);
  },
  params: (req, file) => {
    const folderName = req.service_type;
    return {
      folder: folderName
    }
  }
});

const upload = multer({
  storage: storage,
  limits: 1024 * 1024 * 5
}).any();


module.exports = upload;
