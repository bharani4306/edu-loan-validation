const fs = require("fs");
const path = require("path");
const dataFile = path.join(__dirname, "../data/applications.json");

module.exports = (req, res, next) => {
  const { name, dob, aadhaar, pan, income, course, institution, amount, email } = req.body;

  if (!name || !dob || !aadhaar || !pan || !income || !course || !institution || !amount || !email) {
    return res.status(400).send("❌ All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).send("❌ Invalid email address.");
  if (!/^\d{12}$/.test(aadhaar)) return res.status(400).send("❌ Aadhaar must be 12 digits.");
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) return res.status(400).send("❌ Invalid PAN format.");
  if (Number(income) <= 0 || Number(amount) <= 0) return res.status(400).send("❌ Income and loan amount must be positive.");

  // Check uploaded files are PDF
  const files = req.files;
  for (let key of ["aadhaarFile", "panFile", "incomeFile"]) {
    if (!files[key] || files[key].length === 0) return res.status(400).send(`❌ ${key} is required.`);
    if (files[key][0].mimetype !== "application/pdf") return res.status(400).send(`❌ ${key} must be PDF.`);
  }

  // Check for duplicate Aadhaar/PAN
  const applications = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : [];
  const duplicate = applications.find(a => a.aadhaar === aadhaar || a.pan === pan);
  if (duplicate) {
    return res.status(400).send("⚠️ You have already submitted an application with this Aadhaar or PAN.");
  }

  next();
};

