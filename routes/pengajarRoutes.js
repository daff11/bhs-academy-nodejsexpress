// pengajarRoutes.js
const express = require('express');
const { 
    getPengajar,
    getPengajarById,
    createPengajar,
    updatePengajar,
    deletePengajar,
} = require('../controllers/pengajarController.js');
const router = express.Router();

// GET all pengajar
router.get('/getall', getPengajar);

// GET by Id pengajar
router.get('/:id', getPengajarById);

// CREATE pengajar
router.post('/', createPengajar);

// UPDATE pengajar
router.put('/update/:id', updatePengajar);

// DELETE pengajar
router.delete('/delete', deletePengajar);

module.exports = router;

