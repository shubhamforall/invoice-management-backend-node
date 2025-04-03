const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const sendInvoiceEmail = async (customerEmail, pdfPath) => {
    console.log("Email User:", process.env.EMAIL);
    console.log("Email Password Length:", process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: customerEmail,
        subject: 'Your Invoice from Vishal Transportation Services',
        text: 'Please find attached your invoice.',
        attachments: [{ filename: 'invoice.pdf', path: pdfPath }]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Invoice sent to ${customerEmail}`);
};

module.exports = sendInvoiceEmail;
