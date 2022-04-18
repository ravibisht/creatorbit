import nodeMailer from 'nodemailer'

export default async function sendEmail(options) {
    const transport = nodeMailer.createTransport({
        host: process.env.SMTP,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'Creator Bit <creatorbits@gmail.com>',
        to:options.email,
        subject : options.subject,
        text:options.message,
    }

    return transport.sendMail(mailOptions)
}