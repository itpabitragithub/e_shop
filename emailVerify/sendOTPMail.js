const nodemailer = require('nodemailer')
require('dotenv').config()

const sendOTPMail = async (otp, email) => {
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
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
         
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("OTP sent successfully");
        console.log(info);

    });
}

module.exports = sendOTPMail;









