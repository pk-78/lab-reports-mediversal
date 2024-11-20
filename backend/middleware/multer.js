import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure 'reports' folder exists
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
const uploadFolder = "reports";
ensureFolder(uploadFolder);

// Configure Multer storage with updated naming convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const username = req.body.username || "anonymous"; // Use 'anonymous' if no username
    const originalName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, "_");
    // cb(null, ${username}_${timestamp}_${originalName}${path.extname(file.originalname)});
    cb(
      null,
      `${username}_${timestamp}_${originalName}${path.extname(
        file.originalname
      )}`
    );
  },
});

// Filter to allow specific file types (e.g., PDFs, images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .jpg, .jpeg, and .png formats allowed!"));
  }
};

// Configure upload for a single file
const singleUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
}).array("reportFile", 3); // Allows up to 3 files

// Configure upload for multiple files
const multipleUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 10MB
}).array("reports", 50);

export { singleUpload, multipleUpload };
