const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var profile = require("./profile");
const dotenv = require('dotenv').config();

const app = express();
app.use("/profile", profile);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const data = {
    person: {
      firstName: "Steve",
      lastName: "Schwarzmann"
    }
  };

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  app.post("/thanks", (req, res) => {

    let { email, phoneNumber, company, contactMessage, fullName } = req.body;

    let emailContent = `
      A customer contacted me.
      <br/>His/her name: <i><b>${fullName}</b></i>
      <br> From company: ${company}
      <br/>Phone #: ${phoneNumber}
      <br/>Their message was ${contactMessage}
    `;

    sendEmailToSendGrid(email, emailContent);

    res.render("thanks", { contact: req.body });
    
  });

  res.render("index", data);
});

function sendEmailToSendGrid(emailFrom, emailContent) {
  // using SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require("@sendgrid/mail");

  sgMail.setApiKey(
    process.env.DB_API
  );

  const msg = {
    to: "steven.schwarzmann@gmail.com",
    from: emailFrom,
    subject: "Email from my portfolio site",
    text: emailContent,
    html: emailContent
  };

  sgMail.send(msg);
}

// app.post("/sendemail", (req, res) => {

//   sendEmailToSendGrid()

// });

app.get("/justsendemail", (req, res) => {
  console.log("We will send the email via sendgrid now!");
  sendEmailToSendGrid("abcdefg@example.org", "Hi there, nice site");
  res.send("OK, just sent now!");
});

app.listen(8080, () => {
  console.log("listening at http://localhost:8080");
});
