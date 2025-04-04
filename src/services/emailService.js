const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const sendInvoiceEmail = async (customerEmail, pdfPath) => {
    try {
        // Create reusable transporter object
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Define email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: 'Your Invoice from Vishal Transportation Services',
            text: 'Please find attached your invoice.',
            attachments: [{ filename: 'invoice.pdf', path: pdfPath }]
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log(`✅ Invoice sent successfully to ${customerEmail}`);
        console.log("📩 Message ID:", info.messageId);
        return info;
        
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendInvoiceEmail;

