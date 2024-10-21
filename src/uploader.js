import multer from 'multer';
import config from './config.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        //Indicamos a Multer que guarde el archivo con el nombre original
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage: storage });