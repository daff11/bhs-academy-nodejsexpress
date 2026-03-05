const db = require('../models/index.js');
const { Program, User, Certificates, UserProgress } = db;
const generateCertificatePDF = require('../utils/generateCertificate.js');

const getAllCertificates = async (req, res) => {
    try {
        const userId = req.session.userId;
        const certificates = await Certificates.findAll({
            where: { id_user: userId }, // Sesuai user login
            include: [
                { model: User, as: 'User', attributes: ['fullname'] },
                { model: Program, as: 'Program', attributes: ['nama_program'] }
            ]
        });
        res.status(200).send({
            success: true,
            data: certificates,
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data sertifikat' });
    }
};

const downloadCertificates = async (req, res) => {
    try {
        const userId = req.session.userId;
        const cert = await Certificates.findOne({
            where: { id: req.params.id, id_user: userId, status: 'approved' },
            include: [{ model: User, as: 'User' }, { model: Program, as: 'Program' }]
        });

        if (!cert) {
            return res.status(404).json({ error: 'Sertifikat tidak ditemukan atau belum approved' });
        }

        const pdfPath = await generateCertificatePDF(cert);
        res.download(pdfPath);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengunduh sertifikat' });
    }
};

const createCertificates = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { programId } = req.body;

        // Cek apakah sertifikat sudah ada
        const existingCertificate = await Certificates.findOne({
            where: { id_user: userId, id_program: programId }
        });

        if (existingCertificate) {
            return res.status(400).json({ success: false, message: "Sertifikat sudah ada." });
        }

        // Ambil data progress terakhir
        const userProgress = await UserProgress.findOne({
            where: { id_user: userId, id_program: programId, is_completed: true },
            order: [['completed_at', 'DESC']]
        });

        if (!userProgress) {
            return res.status(400).json({ success: false, message: "Belum menyelesaikan program." });
        }

        // Buat sertifikat baru dengan status default "pending"
        const newCertificate = await Certificates.create({
            id_user: userId,
            id_program: programId,
            status: 'pending', 
            issued_at: new Date()
        });

        res.json({ success: true, certificate: newCertificate });
    } catch (error) {
        console.error("Error creating certificate:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan." });
    }
};

module.exports = {getAllCertificates, downloadCertificates, createCertificates};