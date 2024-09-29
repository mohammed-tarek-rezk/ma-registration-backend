

const nodemailer = require('nodemailer');
const { sendForgetPasswordEmailTemplate, sendVerificationCodeEmailTemplate, sendWelcomeEmailTemplate, sendResetPasswordEmailTemplate } = require('./emilTemplates');

const transporter = nodemailer.createTransport({
    service: "gmail", 
    host: "smtp.gmail.email",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  async function sendVerifcationEmail(email ,name,verifiedCode) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Email Verification", 
      html: sendVerificationCodeEmailTemplate.replace("{{name}}", name).replace("{{code}}" , verifiedCode), 
    });
  }


  async function sendingWelcomeEmail(email , name) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Welcome Email", 
      html: sendWelcomeEmailTemplate.replace("{{name}}" ,name), 
    });
  }


  async function sendingResetPasswordEmail(email , name, resetToken) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Reset MA Registration Password", 
      html: sendForgetPasswordEmailTemplate.replace("{{name}}", name).replace("{{link}}", `${process.env.RESET_EMAIL_URL}/${resetToken}`), 
    });
  }
  async function sendingConfirmResetPassword(email, name) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Reset Password successfully", 
      html: sendResetPasswordEmailTemplate.replace("{{name}}", name) 
    });
  }


  module.exports = {sendVerifcationEmail , sendingWelcomeEmail , sendingResetPasswordEmail, sendingConfirmResetPassword};