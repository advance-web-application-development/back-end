const nodemailer = require("nodemailer");
const configMail = require("../variables/mail");

const user = configMail.user;
const pass = configMail.pass;
const URL = process.env.BACKEND_URL;
console.log("user email", user);
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: user,
    pass: pass,
  },
});
module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Send mail");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello user : ${name}</h2>
          <p>Thank you for your cooperate. Please confirm your email by clicking on the following link</p>
          <a href=${URL}/auth/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};