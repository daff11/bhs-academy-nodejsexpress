const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

//Import Routes
const ProgramRoutes = require('./routes/programRoutes.js');
const indexRoutes = require('./routes/index.js');
const { router: authRoutes, isAuthenticated } = require('./routes/authRoutes.js');
const materiRoutes = require('./routes/materiRoutes.js');
const prospekRoutes = require('./routes/prospekRoutes.js');
const pengajarRoutes = require('./routes/pengajarRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const aboutRoutes = require('./routes/aboutRoutes.js');
const certificatesRoutes = require('./routes/certificatesRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const notificationsRoutes = require('./routes/notificationsRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const app = express();

const corOptions = {
    origin: process.env.BASE_URL
};

// Middleware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware untuk melayani file statis dari folder frontend
app.use(express.static(path.join(__dirname, './frontend/theme')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex'); // Menghasilkan secret dalam format hexadecimal
};

// Konfigurasi session
app.use(
    session({
        secret: generateSecret(),
        resave: false,
        saveUninitialized: false
    })
);

// Middleware untuk menyimpan userId ke res.locals
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
});

// Rute default
app.use('/', indexRoutes);

// Rute untuk autentikasi (login/logout)
app.use('/auth', authRoutes);

// Rute lainnya
app.use('/program', ProgramRoutes);
app.use('/materi', materiRoutes);
app.use('/prospek', prospekRoutes);
app.use('/pengajar', pengajarRoutes);
app.use('/payment', paymentRoutes);
app.use('/user', userRoutes);
app.use('/about', aboutRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/teacher', teacherRoutes);
app.use('/notif', notificationsRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
