const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const sendVerificationEmail = require('../services/sendVerificationEmail.js');
const sendResetPasswordEmail = require('../services/sendResetPasswordEmail.js')
const axios = require('axios');
const failedLoginAttempts = {};

const db = require('../models/index.js');
const { User, Pengajar, Admin } = db;

const registerUser = async (req, res) => {
    try {
        const { fullname, email, phone, password, confirmpassword } = req.body;

        // Pengecekan apakah username atau email sudah terdaftar
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [ { email: email }]
            }
        });

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
        return res.json({
            success: false,
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special symbol'
        });
        }
        if (password !== confirmpassword) {
            return res.json({ success: false, message: 'Password not match!' });
        }

        if (existingUser && existingUser.email === email) {
            return res.json({ success: false, message: 'This email is already registered' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan user baru
        const user = await User.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
            profile_picture: '/uploads/user/profile-user.png'
        });

        console.log('User created successfully:', user); // Debug log

        // Kirim email verifikasi
        await sendVerificationEmail(user);

        res.json({ message: 'User registered! Please verify your email to activate your account.' });
    } catch (error) {
        console.error('Error during registration:', error); // Debug log error
        res.status(500).json({ success: false, message: 'Error registering user.' });
    }
};

const verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
  
      // Cari user berdasarkan token
      const user = await User.findOne({ where: { verificationToken: token } });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
  
      // Update status verifikasi
      user.isVerified = true;
      user.verificationToken = null; // Hapus token setelah verifikasi
      await user.save();
  
      res.redirect('/auth/verify-success');
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Error verifying email.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.CAPTCHA_SECRET_KEY,
                response: captchaToken,
            },
        });

        // Validasi CAPTCHA
        if (!captchaToken) {
            return res.status(400).json({ success: false, message: 'Captcha verification required.' });
        }

        const { success: captchaSuccess } = captchaResponse.data;
        if (!captchaSuccess) {
            return res.status(400).json({ success: false, message: 'Captcha verification failed.' });
        }

        // Validasi input
        if (!email || !password) {
            return res.json({ success: false, message: 'Please provide email and password!' });
        }

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password!' });
        }

        // Periksa verifikasi email
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: 'Please verify your email first!' });
        }

        // Menyimpan session login
        req.session.username = user.fullname;
        req.session.userId = user.id;
        req.session.profileImage = user.profile_picture;
        req.session.lastActivity = Date.now();

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                name: user.fullname,
                profileImage: user.profile_picture,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while logging in.' });
    }
};

const logoutUser = async (req, res) => {
    try {
        // Menghapus session jika menggunakan session-based authentication
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }
            // Menyediakan respons sukses setelah session dihancurkan
            res.status(200).send();
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(); 
    }
};

const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found.' });
    }

    await sendResetPasswordEmail(user);

    return res.json({ success: true, message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Request reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one uppercase letter, one number, and one symbol.',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationToken = null;
    await user.save();

    return res.json({ success: true, message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

const loginPengajar = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.CAPTCHA_SECRET_KEY,
                response: captchaToken,
            },
        });

        // Validasi input
        if (!email || !password) {
            return res.json({ success: false, message: 'Please provide email and password!' });
        }

        // Validasi CAPTCHA
        if (!captchaToken) {
            return res.status(400).json({ success: false, message: 'Captcha verification required.' });
        }

        const { success: captchaSuccess } = captchaResponse.data;
        if (!captchaSuccess) {
            return res.status(400).json({ success: false, message: 'Captcha verification failed.' });
        }

        // Cari user berdasarkan email
        const user = await Pengajar.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password!' });
        }

        // Periksa verifikasi email
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: 'Please verify your email first!' });
        }

        // Menyimpan session login
        req.session.username = user.nama;
        req.session.userId = user.id;
        req.session.profileImage = user.gambar;
        req.session.lastActivity = Date.now();

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                name: user.nama,
                profileImage: user.gambar,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while logging in.' });
    }
};

const registerPengajar = async (req, res) => {
    try {
        const { fullname, email, phone, password, confirmpassword } = req.body;

        // Pengecekan apakah username atau email sudah terdaftar
        const existingUser = await Pengajar.findOne({
            where: {
                [Op.or]: [ { email: email }]
            }
        });

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password harus memiliki minimal 8 karakter.' });
        }
        if (password !== confirmpassword) {
            return res.json({ success: false, message: 'Password tidak cocok.' });
        }

        if (existingUser && existingUser.email === email) {
            return res.json({ success: false, message: 'Email sudah terdaftar.' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan user baru
        const user = await Pengajar.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
            isVerified: false
        });

        console.log('User created successfully:', user); // Debug log

        // Kirim email verifikasi
        await sendVerificationEmail(user);

        res.json({ message: 'User registered! Please verify your email to activate your account.' });
    } catch (error) {
        console.error('Error during registration:', error); // Debug log error
        res.status(500).json({ success: false, message: 'Error registering user.' });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password} = req.body;

        // Validasi input
        if (!email || !password) {
            return res.json({ success: false, message: 'Please provide email and password!' });
        }

        // Cari user berdasarkan email dan password
        const user = await Admin.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password!' });
        }

        // Menyimpan session login
        req.session.username = user.username; // <- Ganti jadi username
        req.session.userId = user.id;          // <- Ganti jadi userId
        req.session.profileImage = user.profile_picture; // Biar sama juga
        req.session.lastActivity = Date.now();

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                name: user.username,
                profileImage: user.profile_picture,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while logging in.' });
    }
};

module.exports = {
    registerUser, loginUser, logoutUser, 
    verifyEmail, requestResetPassword, resetPassword, 
    loginPengajar, registerPengajar, loginAdmin, };