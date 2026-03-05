// pengajarController
const db = require('../models/index.js');

const Pengajar = db.Pengajar;

// GET ALL Pengajar
const getPengajar = async (req, res) => {
    try {
        const pengajar = await Pengajar.findAll();
        
        if (!pengajar || pengajar.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Pengajar Records Found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'All Pengajar Records',
            data: pengajar,
        });
    } catch (error) {
        console.error('Error fetching all pengajar:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching pengajar',
            error: error.message,
        });
    }
};

// GET Pengajar by ID
const getPengajarById = async (req, res) => {
    const { id } = req.params;
    try {
        const pengajar = await Pengajar.findByPk(id);

        if (!pengajar) {
            return res.status(404).send({
                success: false,
                message: 'Pengajar not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Pengajar Record Found',
            data: pengajar,
        });
    } catch (error) {
        console.error('Error fetching pengajar by ID:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching pengajar by ID',
            error: error.message,
        });
    }
};

// CREATE Pengajar
const createPengajar = async (req, res) => {
    try {
        const { nama } = req.body;

        // Validasi input
        if (!nama) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Membuat data pengajar baru
        const pengajar = await Pengajar.create({
            nama,
        });

        res.status(201).send({
            success: true,
            message: 'Pengajar created successfully',
            data: pengajar,
        });
    } catch (error) {
        console.error('Error creating pengajar:', error);
        res.status(500).send({
            success: false,
            message: 'Error creating pengajar',
            error: error.message,
        });
    }
};

// UPDATE Pengajar
const updatePengajar = async (req, res) => {
    const { id } = req.params;
    const { nama } = req.body;
    
    try {
        const pengajar = await Pengajar.findByPk(id);

        if (!pengajar) {
            return res.status(404).send({
                success: false,
                message: 'Pengajar not found',
            });
        }

        // Update data pengajar
        pengajar.nama = nama || pengajar.nama;

        await pengajar.save();

        res.status(200).send({
            success: true,
            message: 'Pengajar updated successfully',
            data: pengajar,
        });
    } catch (error) {
        console.error('Error updating pengajar:', error);
        res.status(500).send({
            success: false,
            message: 'Error updating pengajar',
            error: error.message,
        });
    }
};

// DELETE Pengajar
const deletePengajar = async (req, res) => {
    const { id } = req.params;
    try {
        const pengajar = await Pengajar.findByPk(id);

        if (!pengajar) {
            return res.status(404).send({
                success: false,
                message: 'Pengajar not found',
            });
        }

        await pengajar.destroy();

        res.status(200).send({
            success: true,
            message: 'Pengajar deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting pengajar:', error);
        res.status(500).send({
            success: false,
            message: 'Error deleting pengajar',
            error: error.message,
        });
    }
};

module.exports = {
    getPengajar,
    getPengajarById,
    createPengajar,
    updatePengajar,
    deletePengajar,
};
