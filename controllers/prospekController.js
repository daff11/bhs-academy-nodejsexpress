// prospekController
const db = require('../models/index.js');

const Prospek = db.Prospek;

// GET ALL Prospek
const getProspek = async (req, res) => {
    try {
        const prospek = await Prospek.findAll();
        
        if (!prospek || prospek.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Prospek Records Found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'All Prospek Records',
            data: prospek,
        });
    } catch (error) {
        console.error('Error fetching all prospek:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching prospek',
            error: error.message,
        });
    }
};

// GET Prospek by ID
const getProspekById = async (req, res) => {
    const { id } = req.params;
    try {
        const prospek = await Prospek.findByPk(id);

        if (!prospek) {
            return res.status(404).send({
                success: false,
                message: 'Prospek not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Prospek Record Found',
            data: prospek,
        });
    } catch (error) {
        console.error('Error fetching prospek by ID:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching prospek by ID',
            error: error.message,
        });
    }
};

// CREATE Prospek
const addProspek = async (req, res) => {
  try {
    const { nama } = req.body;
    await Prospek.create({ nama });

    res.status(201).json({
      success: true,
      message: 'Prospek berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error tambah prospek:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan prospek',
      error: error.message,
    });
  }
};

// EDIT Prospek
const editProspek = async (req, res) => {
  try {
    const { id } = req.params;    // ambil id dari params
    const { nama } = req.body;    // ambil nama dari body

    if (!id || !nama) {
      return res.status(400).json({
        success: false,
        message: 'ID dan Nama harus diisi',
      });
    }

    const prospek = await Prospek.findByPk(id);
    if (!prospek) {
      return res.status(404).json({
        success: false,
        message: 'Prospek tidak ditemukan',
      });
    }

    prospek.nama = nama;
    await prospek.save();

    res.json({
      success: true,
      message: 'Prospek berhasil diubah',
    });
  } catch (error) {
    console.error('Error edit prospek:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengedit prospek',
      error: error.message,
    });
  }
};

// DELETE Prospek
const deleteProspek = async (req, res) => {
  try {
    const { id } = req.params;

    const prospek = await Prospek.findByPk(id);
    if (!prospek) {
      return res.status(404).json({
        success: false,
        message: 'Prospek tidak ditemukan',
      });
    }

    await prospek.destroy();

    res.json({
      success: true,
      message: 'Prospek berhasil dihapus',
    });
  } catch (error) {
    console.error('Error hapus prospek:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus prospek',
      error: error.message,
    });
  }
};

module.exports = {
    getProspek,
    getProspekById,
    addProspek,
    editProspek,
    deleteProspek,
};
