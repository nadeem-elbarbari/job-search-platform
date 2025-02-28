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

async function sendMail(to, subject, html, buffer = null, filename = null) {
    const mailOptions = {
        from: `"Nadeem's App" <${user}>`, // Sender address
        to: to, // Recipient(s)
        subject: subject, // Subject line
        html: html || 'No HTML content provided.', // Default text if no HTML
        attachments: buffer
            ? [
                  {
                      filename: filename,
                      content: buffer,
                      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  },
              ]
            : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
}


export default sendMail;
