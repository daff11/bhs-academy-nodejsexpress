const db = require('../models/index.js');

// Create main Model
const Coorporate = db.Coorporate;
const Materi = db.Materi;
const Prospek = db.Prospek;
const Pengajar = db.Pengajar;

// Get all Coorporates
const getAllCoorporates = async (req, res) => {
    try {
        const coorporate = await Coorporate.findAll({
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = coorporate.map(coorporate => {
            return {
                id: coorporate.id,
                gambar: coorporate.gambar,
                nama_program: coorporate.nama_program,
                durasi_hari: coorporate.durasi_hari,
                durasi_jamhari: coorporate.durasi_jamhari,
                harga: coorporate.harga,
                detail: coorporate.detail,
                createdAt: coorporate.createdAt,
                updatedAt: coorporate.updatedAt,
                materi: coorporate.Materi, 
                prospek: coorporate.Prospek,
                pengajar: coorporate.Pengajar,
            };
        });

        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
};

// Get Coorporate by ID
const getCoorporateById = async (req, res) => {
    const { id } = req.params;
    try {
        const coorporate = await Coorporate.findByPk(id, {
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = {
            id: coorporate.id,
            gambar: coorporate.gambar,
            nama_program: coorporate.nama_program,
            durasi_hari: coorporate.durasi_hari,
            durasi_jamhari: coorporate.durasi_jamhari,
            harga: coorporate.harga,
            detail: coorporate.detail,
            createdAt: coorporate.createdAt,
            updatedAt: coorporate.updatedAt,
            materi: coorporate.Materi, 
            prospek: coorporate.Prospek,
            pengajar: coorporate.Pengajar,
        };
        
        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Coorporate by ID API',
            error: error.message,
        });
    }
};

module.exports =  {
    getAllCoorporates,
    getCoorporateById,
};
