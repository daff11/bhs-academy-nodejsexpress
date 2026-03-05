const express = require('express');
const path = require('path');
const {
    getAllCoorporates, 
    getCoorporateById,
    getAllShortCourses,
    getShortCoursesById,
    getAllProjectBased,
    getProjectBasedById,
    get3Coorporates,
    get3ShortCourses,
    get3ProjectBased,
    getAllPrograms,
    createPrograms,
    getProgramsType,
    getProgramById,
    editProgram,
    deleteProgram
} = require('../controllers/programController.js');
const { createChapters, getChaptersByProgramId, replaceChapters } = require('../controllers/chapterController.js');
const {isAuthenticated} = require('./authRoutes.js');
const upload = require('../config/upload.js');
const { getProgramPurchaseAll } = require('../controllers/paymentController.js');

const router = express.Router(); 

// POST Program
router.post('/addprogram', upload.single('gambar'), createPrograms);

// EDIT Program
router.put('/editprogram/:id', upload.single('gambar'),editProgram);

// DELETE Program
router.delete('/delete/:id');

// GET Add Programs Page
router.get('/add', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/admin_Addprograms.html'));
});

//GET Edit Programs Page (the page is same like add)
router.get('/edit/:id', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/admin_Addprograms.html'));
});

//GET Program Purchased All
router.get('/purchasedall', getProgramPurchaseAll);

// GET Program Types
router.get('/alltype', getProgramsType);

//GET Chapters 
router.get('/chapter/:programId', getChaptersByProgramId);

// POST Chapter
router.post('/addchapter', createChapters);

// EDIT Chapter
router.put('/replacechapters/:id_programs', replaceChapters);

// GET All Programs
router.get('/all', getAllPrograms);

// DELETE Program by ID
router.delete('/delete/:id', deleteProgram);

// GET By ID Program
router.get('/getbyid/:id', getProgramById);

// GET Coorporate page (HTML)
router.get('/coorporate', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/coorporate.html'));
});
router.get('/coorporate/single', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/coorporate-single.html'));
});

router.get('/payment-details', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/coorporate-payment.html'));
});

// GET Short Courses page (HTML)
router.get('/shortcourses', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/shortcourses.html'));
});
router.get('/shortcourses/single', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/shortcourses-single.html'));
});

router.get('/shortcourses/payment-details', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/shortcourses-payment.html'));
});

// GET Project Based page (HTML)
router.get('/projectbased', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/projectbased.html'));
});
router.get('/projectbased/single', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/projectbased-single.html'));
});

router.get('/projectbased/payment-details', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/projectbased-payment.html'));
});

// GET all Coorporate data
router.get('/coorporateall', getAllCoorporates); 
// GET 3 Coorporate data
router.get('/coorporate3', get3Coorporates); 
// GET Coorporate by ID
router.get('/coorporateid/:id', getCoorporateById); 

// GET all Short Courses data
router.get('/shortcoursesall', getAllShortCourses); 
// GET 3 Short Courses data
router.get('/shortcourses3', get3ShortCourses); 
// GET Short Courses by ID
router.get('/shortcoursesid/:id', getShortCoursesById); 

// GET all Project Based data
router.get('/projectbasedall', getAllProjectBased); 
// GET 3 Project Based data
router.get('/projectbased3', get3ProjectBased); 
// GET Project Based by ID
router.get('/projectbasedid/:id', getProjectBasedById); 

module.exports = router;
