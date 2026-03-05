const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

async function generateCertificatePDF(cert) {
    const templatePath = path.join(__dirname, '../templates/bhs_sertif.pdf');
    const pdfDoc = await PDFDocument.load(fs.readFileSync(templatePath));
    const page = pdfDoc.getPages()[0];

    page.drawText(cert.User.fullname, { x: 250, y: 400, size: 24, color: rgb(0, 0, 0) });
    page.drawText(cert.Program.nama_program, { x: 250, y: 350, size: 18, color: rgb(0, 0, 0) });
    
    const completedAt = cert.UserProgress ? new Date(cert.UserProgress.completed_at).toDateString() : "N/A";
    page.drawText(completedAt, { x: 250, y: 300, size: 14, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, '../cert/cert_${cert.id}.pdf');
    fs.writeFileSync(outputPath, pdfBytes);

    return outputPath;
}

module.exports = generateCertificatePDF;
