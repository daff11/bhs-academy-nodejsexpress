const User = require('../models/User.js');

const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.session.userId; // Ambil userId dari sesi
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        // Cari data user berdasarkan userId
        const user = await User.findByPk(userId, {
            attributes: ['fullname', 'email', 'phone', 'profile_picture']
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Kirim data user
        res.status(200).json({ success: true, data: user });
    } catch (error) {  
        console.error(error);
        res.status(500).json({ success: false, message: 'Error getting user data.' });
    }
};

module.exports = {
    getAllUsers,
    getUserById
}
