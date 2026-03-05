const db = require('../models/index.js');
const dotenv = require('dotenv');
dotenv.config();

const { Notifications, ProgramPurchase } = db;

//GET ALL
const getAllNotifications = async (req, res) => {
    try {
      const userId = req.session.userId;
  
      const notifications = await Notifications.findAll({
        where: { id_user: userId },
        include: [
          {
            model: ProgramPurchase,
            as: 'purchase',
            attributes: ['id_program', 'bank']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const mapped = notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        url: n.url,
        createdAt: n.createdAt,
        programId: n.purchase?.id_program || null,
        programBank: n.purchase?.bank || null,
        is_read: n.is_read 
      }));
  
      res.json({ success: true, data: mapped });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};

// GET /notif/count
const getNotificationCount = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.json({ success: false });
  
      const count = await Notifications.count({
        where: { id_user: userId, is_read: false }
      });
  
      res.json({ success: true, count });
    } catch (err) {
      console.error('Gagal ambil jumlah notif:', err);
      res.status(500).json({ success: false });
    }
};
  
// PATCH /notif/mark-as-read/:id
const markNotificationAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
  
      const notif = await Notifications.findOne({
        where: { id, id_user: userId }
      });
  
      if (!notif) return res.status(404).json({ success: false, message: "Notification not found" });
  
      await notif.update({ is_read: true });
      res.json({ success: true });
    } catch (err) {
      console.error("Gagal update notif:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getAllNotifications,
    getNotificationCount,
    markNotificationAsRead
}; 