
import multer from "multer"


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ "_" + file.originalname);
    },
});

export const uploadUserImage = multer({ storage: storage,
    image: {
        compress: true,
        quality: 80
      }
});



// uploadUserImage.single("profile")
// const image = req.file;