const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sbharanidharan4306@gmail.com",  // Replace with your Gmail
    pass: "dzvz gwpb pdqq tezc"      // App password if 2FA enabled
  }
});

async function sendStatusEmail(to, name, status) {
  let message = "";

  if (status === "Received") {
    message = `<p>Hi ${name},</p>
               <p>Your education loan application has been <b>received</b> successfully.</p>
               <p>We will notify you once it is processed.</p>`;
  } else {
    message = `<p>Hi ${name},</p>
               <p>Your education loan application has been <b>${status}</b>.</p>
               <p>Thank you.</p>`;
  }

  const mailOptions = {
    from: '"Education Loan Portal" <sbharanidharan4306@gmail.com>',
    to,
    subject: `Education Loan Application Status`,
    html: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = { sendStatusEmail };

