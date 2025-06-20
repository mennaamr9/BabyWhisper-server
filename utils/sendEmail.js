const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create transporter (gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT, 
    secure:true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });
   
  //Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject:options.subject,
    text:options.message
  };

  //send email 
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
