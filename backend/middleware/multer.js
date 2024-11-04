import multer from 'multer';
import path from 'path';

// Configure Multer to store files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'reports'); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to allow specific file types (e.g., PDFs, images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .jpg, .jpeg, and .png formats allowed!'));
  }
};

// Initialize multer with the storage and file filter configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 5MB
}).array('reports', 50);

export default upload;
