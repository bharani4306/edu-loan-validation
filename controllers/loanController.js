const path = require("path");
const fs = require("fs");
const { sendStatusEmail } = require("../utils/email");

const dataFile = path.join(__dirname, "../data/applications.json");
let applications = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : [];

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));
}

function classifyIncome(income) {
  if (income <= 300000) return "Low";
  if (income <= 800000) return "Middle";
  return "Upper";
}

exports.handleLoanApplication = async (req, res) => {
  const { name, dob, aadhaar, pan, income, course, institution, amount, email } = req.body;

  const incomeGroup = classifyIncome(Number(income));

  const newApp = {
    id: applications.length + 1,
    name,
    dob,
    email,
    aadhaar,
    pan,
    income: Number(income),
    course,
    institution,
    amount: Number(amount),
    incomeGroup,
    files: {
      aadhaar: req.files["aadhaarFile"][0].filename,
      pan: req.files["panFile"][0].filename,
      income: req.files["incomeFile"][0].filename
    },
    status: "Pending"
  };

  applications.push(newApp);
  saveData();

  // Send email notification after registration
  try {
    await sendStatusEmail(email, name, "Received");
    console.log(`Notification email sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }

  // Redirect or show success page
  res.sendFile(path.join(__dirname, "../public/success.html"));
};

