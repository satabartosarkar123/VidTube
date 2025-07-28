import multer from "multer"; // for handling multipart/form-data

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp') // specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({storage }); // create an instance of multer with the specified storage configuration
