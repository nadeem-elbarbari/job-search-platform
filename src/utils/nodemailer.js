import nodemailer from 'nodemailer';

const user = process.env.EMAIL;

const pass = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: user,
        pass: pass,
    },
});

async function sendMail(to, subject, html) {
    const info = await transporter.sendMail({
        from: `"Nadeem's App" <${user}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    console.log('Message sent: %s', info.messageId);
}

export default sendMail;
