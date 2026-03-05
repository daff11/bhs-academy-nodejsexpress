// materiController
const db = require('../models/index.js');

const Materi = db.Materi;

// GET ALL Materi
const getMateri = async (req, res) => {
    try {
        const materi = await Materi.findAll();
        
        if (!materi || materi.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Materi Records Found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'All Materi Records',
            data: materi,
        });
    } catch (error) {
        console.error('Error fetching all materi:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching materi',
            error: error.message,
        });
    }
};

// GET Materi by ID
const getMateriById = async (req, res) => {
    const { id } = req.params;
    try {
        const materi = await Materi.findByPk(id);

        if (!materi) {
            return res.status(404).send({
                success: false,
                message: 'Materi not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Materi Record Found',
            data: materi,
        });
    } catch (error) {
        console.error('Error fetching materi by ID:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching materi by ID',
            error: error.message,
        });
    }
};

// CREATE Materi
const addMateri = async (req, res) => {
  try {
    const { nama } = req.body;
    await Materi.create({ nama });

    res.status(201).json({
      success: true,
      message: 'Materi berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error tambah materi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan materi',
      error: error.message,
    });
  }
};

// EDIT Materi
const editMateri = async (req, res) => {
  try {
    const { id } = req.params;    // ambil id dari params
    const { nama } = req.body;    // ambil nama dari body

    if (!id || !nama) {
      return res.status(400).json({
        success: false,
        message: 'ID dan Nama harus diisi',
      });
    }

    const materi = await Materi.findByPk(id);
    if (!materi) {
      return res.status(404).json({
        success: false,
        message: 'Materi tidak ditemukan',
      });
    }

    materi.nama = nama;
    await materi.save();

    res.json({
      success: true,
      message: 'Materi berhasil diubah',
    });
  } catch (error) {
    console.error('Error edit materi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengedit materi',
      error: error.message,
    });
  }
};

// DELETE Materi
const deleteMateri = async (req, res) => {
  try {
    const { id } = req.params;

    const materi = await Materi.findByPk(id);
    if (!materi) {
      return res.status(404).json({
        success: false,
        message: 'Materi tidak ditemukan',
      });
    }

    await materi.destroy();

    res.json({
      success: true,
      message: 'Materi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error hapus materi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus materi',
      error: error.message,
    });
  }
};


module.exports = {
    getMateri,
    getMateriById,
    addMateri,
    editMateri,
    deleteMateri
};
