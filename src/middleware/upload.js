import multer from 'multer';
import path from 'path';

const excelFilter = (req, file, cb) => {
    const filetypes = /sql/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = (file.mimetype.includes('sql') || file.mimetype.includes('spreadsheetml'));
    if (mimetype && extname) cb(null, true);
    else cb({ message: 'Please upload only sql file, with extension: .sql.' }, false);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        /* console.log(file.originalname); */
        cb(null, `${Date.now()}-costall-${file.originalname}`);
    },
});

const uploadFile = multer({ storage, fileFilter: excelFilter });
export default uploadFile;
