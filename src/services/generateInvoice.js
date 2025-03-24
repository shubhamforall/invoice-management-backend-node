const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateInvoice(data) {
    const templatePath = path.join(__dirname, '../templates/invoiceTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlTemplate = htmlTemplate.replace(regex, data[key]);
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    const pdfPath = path.join(__dirname, `../invoices/invoice_${data.invoiceNumber}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();
    return pdfPath;
}

module.exports = generateInvoice;
