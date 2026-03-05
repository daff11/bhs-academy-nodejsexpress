// materiRoutes.js
const express = require('express');
const { 
    getMateri,
    getMateriById,
    addMateri,
    editMateri,
    deleteMateri,
} = require('../controllers/materiController.js');
const router = express.Router();

// GET all materi
router.get('/all', getMateri);

// GET by Id materi
router.get('/:id', getMateriById);

// CREATE (POST) materi
router.post('/create', addMateri);

// UPDATE (PATCH) materi
router.patch('/update/:id', editMateri);

// DELETE materi
router.delete('/delete/:id', deleteMateri);

module.exports = router;

