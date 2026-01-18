const nodemailer = require('nodemailer')
require('dotenv').config()

const verifyEmail = async (token, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5173/verify/${token} 
           Thanks`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent successfully");
        console.log(info);

    });
}

module.exports = verifyEmail;









