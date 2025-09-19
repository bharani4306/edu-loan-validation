const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";
    if (file.fieldname === "aadhaarFile") folder += "aadhaar/";
    else if (file.fieldname === "panFile") folder += "pan/";
    else if (file.fieldname === "incomeFile") folder += "income/";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

module.exports = multer({ storage: storage });

