// prospekRoutes.js
const express = require('express');
const { 
    getProspek,
    getProspekById,
    addProspek,
    editProspek,
    deleteProspek,
} = require('../controllers/prospekController.js');
const router = express.Router();

// GET all prospek
router.get('/all', getProspek);

// GET by Id prospek
router.get('/:id', getProspekById);

// CREATE (POST) prospek
router.post('/create', addProspek);

// UPDATE (PATCH) prospek
router.patch('/update/:id', editProspek);

// DELETE prospek
router.delete('/delete/:id', deleteProspek);

module.exports = router;

