import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendOTPMail = async (otp, email) => {
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

        subject: 'Password Reset OTP',

        html: `<p>Your OTP for password reset is:<b>${otp}</b></p>`
    };
    try {
        const info = await transporter.sendMail(mailConfigurations)
        console.log('OTP Sent Successfully');
        console.log(info);
    } catch (error) {
        console.error('Failed to send OTP email:', error.message)
        throw error
    }
}


