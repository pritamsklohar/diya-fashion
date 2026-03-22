import nodemailer from 'nodemailer'
import 'dotenv/config'

export const verifyEmail = async (token, email) => {
    const mailUser = (process.env.MAIL_USER || '').trim()
    const mailPass = (process.env.MAIL_PASS || '').replace(/\s+/g, '')

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailUser,
            pass: mailPass
        }
    });

    const mailConfigurations = {

        from: mailUser,

        to: email,

        subject: 'Email Verification',

        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:5173/verify/${token} 
               Thanks`
    };
    try {
        const info = await transporter.sendMail(mailConfigurations)
        console.log('Email Sent Successfully');
        console.log(info);
    } catch (error) {
        console.error('Failed to send verification email:', error.message)
    }
}


