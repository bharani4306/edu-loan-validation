const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUpload");
const validateForm = require("../middleware/validateMiddleware");
const { handleLoanApplication } = require("../controllers/loanController");
const { sendStatusEmail } = require("../utils/email");

const dataFile = path.join(__dirname, "../data/applications.json");

// =====================
// User Loan Submission
// =====================
router.post(
  "/apply",
  upload.fields([
    { name: "aadhaarFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "incomeFile", maxCount: 1 }
  ]),
  validateForm,
  handleLoanApplication
);

// =====================
// Admin Login Routes
// =====================
router.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin-login.html"));
});

router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  // Simple admin check
  if (username === "admin" && password === "12345") {
    req.session.isAdmin = true; // set session
    res.redirect("/admin");     // redirect to dashboard
  } else {
    res.send("<h3>Invalid Credentials</h3><a href='/admin-login'>Try Again</a>");
  }
});

// =====================
// Admin Dashboard (Protected)
// =====================
router.get("/admin", authMiddleware, (req, res) => {
  // Only accessible if logged in
  res.sendFile(path.join(__dirname, "../views/admin-dashboard.html"));
});

// Get applications JSON (for dashboard)
router.get("/get-applications", authMiddleware, (req, res) => {
  const applications = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : [];
  res.json(applications);
});

// Update application status (Approve / Reject) with email notification
router.get("/update-status/:id/:status", authMiddleware, async (req, res) => {
  let applications = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : [];
  const appIndex = applications.findIndex(a => a.id == req.params.id);

  if (appIndex !== -1) {
    applications[appIndex].status = req.params.status;
    fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));

    const applicant = applications[appIndex];
    await sendStatusEmail(applicant.email, applicant.name, req.params.status);
  }

  res.redirect("/admin");
});

// Logout admin
router.get("/admin-logout", authMiddleware, (req, res) => {
  req.session.destroy();
  res.redirect("/admin-login");
});

module.exports = router;

