const express = require("express");
const path = require("path");
const session = require("express-session");
const loanRoutes = require("./routes/loanRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use("/", loanRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
