const midtransClient = require('midtrans-client');
const db = require('../models/index.js');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const { ProgramPurchase, Program, User, Program_Type, Notifications } = db;

// Setup Midtrans API
const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY,
  });
  
const createTransaction = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { programId } = req.params;
        const { bank } = req.body;

        if (!userId || !programId || !bank) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        const user = await User.findByPk(userId);
        const program = await Program.findByPk(programId);
        if (!user || !program) {
        return res.status(404).json({ success: false, message: 'User atau program tidak ditemukan' });
        }

        // Cek apakah user sudah punya pembelian yang pending
        let purchase = await ProgramPurchase.findOne({
            where: {
              id_user: userId,
              id_program: programId,
              status: 'pending',
            }
          });
          
        if (purchase) {
        // Jika bank sebelumnya beda, update VA baru
        if (purchase.bank !== bank) {
            // Update bank di database
            await purchase.update({ bank });
        
            // Buat ulang transaksi Midtrans
            const transaction = {
            payment_type: 'bank_transfer',
            transaction_details: {
                order_id: `order-${purchase.id}`, // bisa tetap pakai ID lama
                gross_amount: purchase.amount,
            },
            bank_transfer: {
                bank,
            },
            customer_details: {
                first_name: user.fullname,
                email: user.email,
                phone: user.phone,
            },
            };
        
            const chargeRes = await core.charge(transaction);
            const vaNumber = chargeRes.va_numbers?.[0]?.va_number || chargeRes.permata_va_number;
        
            // Simpan VA baru
            await purchase.update({ va_number: vaNumber });
        
            return res.status(200).json({
            success: true,
            va_number: vaNumber,
            bank,
            gross_amount: purchase.amount,
            purchaseDate: purchase.purchase_date,
            deadlineDate: purchase.deadline_date,
            updated_bank: true,
            previous_bank: purchase.bank,
            });
        } else {
            // Jika bank sama, cukup kirim ulang data lama
            return res.status(200).json({
            success: true,
            va_number: purchase.va_number,
            bank: purchase.bank,
            gross_amount: purchase.amount,
            purchaseDate: purchase.purchase_date,
            deadlineDate: purchase.deadline_date,
            });
        }
        } else {
        // Belum ada transaksi pending → buat baru
        const purchaseDate = new Date();
        const deadlineDate = new Date(purchaseDate.getTime() + 48 * 60 * 60 * 1000);

        let discountedPrice = program.harga;
        if (program.diskon !== null && program.diskon > 0) {
        const discount = program.harga * program.diskon / 100;
        discountedPrice = program.harga - discount;
        }
        
        const newPurchase = await ProgramPurchase.create({
            id_user: userId,
            id_program: programId,
            purchase_date: purchaseDate,
            deadline_date: deadlineDate,
            amount: discountedPrice,
            status: 'pending',
            bank,
        });
        
        const transaction = {
            payment_type: 'bank_transfer',
            transaction_details: {
            order_id: `order-${newPurchase.id}`,
            gross_amount: discountedPrice,
            },
            bank_transfer: {
            bank,
            },
            customer_details: {
            first_name: user.fullname,
            email: user.email,
            phone: user.phone,
            },
        };
        
        const chargeRes = await core.charge(transaction);
        const vaNumber = chargeRes.va_numbers?.[0]?.va_number || chargeRes.permata_va_number;
        
        await newPurchase.update({ va_number: vaNumber });
        await Notifications.create({
            id_user: userId,
            id_purchase: newPurchase.id,
            title: 'New Transaction Added!',
            message: `Your payment for Program "${program.nama_program}" is in <strong>pending</strong>. <br>Please pay before ${newPurchase.deadline_date.toLocaleString('id-ID')}.`,
            type: 'info',
            url: `/user/payments-history`,
        });
        
        return res.status(200).json({
            success: true,
            va_number: vaNumber,
            bank,
            gross_amount: discountedPrice,
            purchaseDate: newPurchase.purchase_date,
            deadlineDate: newPurchase.deadline_date,
        });
        }

    } catch (error) {
        console.error('Error Core API transaction:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
  
// Handle payment notification from Midtrans
const handlePaymentNotification = async (req, res) => {
  try {
      const notification = req.body;
      const orderId = notification.order_id.replace('order-', '');
      const transactionStatus = notification.transaction_status;

      // Verifikasi Signature
      const midtransServerKey = process.env.SERVER_KEY;
      const payload = `${notification.order_id}${notification.status_code}${notification.gross_amount}${midtransServerKey}`;
      const calculatedSignature = crypto.createHash('sha512').update(payload).digest('hex');

      if (calculatedSignature !== notification.signature_key) {
          return res.status(400).json({ success: false, message: 'Invalid signature' });
      }

      const programPurchase = await ProgramPurchase.findByPk(orderId);
      if (!programPurchase) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Perbarui status berdasarkan transaction_status
      if (transactionStatus === 'settlement') {
          programPurchase.status = 'completed';
          programPurchase.purchase_date = new Date();
            // Buat notifikasi baru
            const userId = programPurchase.id_user;
            const program = await Program.findByPk(programPurchase.id_program);
            await Notifications.create({
                id_user: userId,
                id_purchase: programPurchase.id,
                title: 'Payment Success!',
                message: `Thank you for your purchase. Now you can access <strong>${program.nama_program}</strong> in My Class`,
                type: 'info',
                url: `/user/myclass`
            });
      } else if (transactionStatus === 'pending') {
          programPurchase.status = 'pending';
      } else if (['cancel', 'expire'].includes(transactionStatus)) {
          programPurchase.status = 'cancelled';
      } else if (transactionStatus === 'deny') {
          programPurchase.status = 'denied';
      }

      await programPurchase.save();
      return res.status(200).send('OK');
  } catch (error) {
      console.error('Error processing payment notification:', error);
      return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const validateMidtransWebhook = (req, res, next) => {
  try {
      const midtransServerKey = process.env.SERVER_KEY;

      // Ambil signature dari payload, bukan header
      const { signature_key, order_id, status_code, gross_amount } = req.body;

      const payload = `${order_id}${status_code}${gross_amount}${midtransServerKey}`;
      const calculatedSignature = crypto.createHash('sha512').update(payload).digest('hex');

      if (signature_key !== calculatedSignature) {
          return res.status(400).json({ success: false, message: 'Signature mismatch' });
      }

      next(); // Lolos validasi
  } catch (error) {
      console.error('Error validating Midtrans webhook:', error);
      res.status(500).json({ success: false, message: 'Error validating Midtrans webhook' });
  }
};

//GET ProgramPurchaseAll
const getProgramPurchaseAll = async (req, res) => {
    try {
        const purchases = await ProgramPurchase.findAll({
            include: [
                {
                    model: Program,
                    attributes: ['id', 'nama_program', 'detail', 'gambar', 'harga'],
                    include: [
                        {
                            model: Program_Type,
                            as: 'Type', 
                            attributes: ['id', 'nama'],
                        }
                    ],
                },
                {
                    model: User, 
                    as: 'User',
                    attributes: ['email']
                  }
            ],
        });

        if (!purchases.length) {
            return res.status(404).json({ success: false});
        }

        res.status(200).json({
            success: true,
            data: purchases.map((purchase) => ({
                programPurchaseId: purchase.id,
                programId: purchase.Program.id,
                programUser: purchase.User ? purchase.User.email : '-',
                programStatus: purchase.status,
                programPurchaseName: purchase.Program.nama_program,
                programPurchaseDetail: purchase.Program.detail,
                programPurchaseType: purchase.Program.Type ? purchase.Program.Type.nama : 'Tipe Tidak Diketahui', // Perbaiki akses dengan 'Type'
                programPurchaseGambar: purchase.Program.gambar || '/default-gambar.jpg',
                programPurchaseHarga: purchase.amount,
                programPurchaseDate: purchase.purchase_date,
                programDeadlineDate: purchase.deadline_date,
                programBank: purchase.bank,
                programVA: purchase.va_number,
            })),
        });
    } catch (error) {
        console.error('Error fetching program purchases:');
        
    }
};

//GET ProgramPurchase By UserId
const getProgramPurchaseByUserId = async (req, res) => {
    try {
        const userId = req.session.userId; // Mendapatkan userId dari sesi

        const purchases = await ProgramPurchase.findAll({
            where: { id_user: userId},
            include: [
                {
                    model: Program,
                    attributes: ['id', 'nama_program', 'detail', 'gambar', 'harga'],
                    include: [
                        {
                            model: Program_Type,
                            as: 'Type', // Gunakan alias 'Type'
                            attributes: ['id', 'nama'],
                        }
                    ],
                },
            ],
        });

        if (!purchases.length) {
            return res.status(404).json({ success: false});
        }

        res.status(200).json({
            success: true,
            data: purchases.map((purchase) => ({
                programPurchaseId: purchase.id,
                programId: purchase.Program.id,
                programStatus: purchase.status,
                programPurchaseName: purchase.Program.nama_program,
                programPurchaseDetail: purchase.Program.detail,
                programPurchaseType: purchase.Program.Type ? purchase.Program.Type.nama : 'Tipe Tidak Diketahui', // Perbaiki akses dengan 'Type'
                programPurchaseGambar: purchase.Program.gambar || '/default-gambar.jpg',
                programPurchaseHarga: purchase.amount,
                programPurchaseDate: purchase.purchase_date,
                programDeadlineDate: purchase.deadline_date,
                programBank: purchase.bank,
                programVA: purchase.va_number,
            })),
        });
    } catch (error) {
        console.error('Error fetching program purchases:');
        
    }
};

//Preload Payment 
const getPreloadPayment =  async (req, res) => {
    try {
        const { programId } = req.params;
        const program = await Program.findByPk(programId);

        if (!program) {
            return res.json({ success: false, message: "Program tidak ditemukan" });
        }

        let discountedPrice = program.harga;
        if (program.diskon !== null && program.diskon > 0) {
        const discount = program.harga * program.diskon / 100;
        discountedPrice = program.harga - discount;
        }

        res.json({
            success: true,
            gross_amount: discountedPrice
        });
    } catch (err) {
        console.error("Gagal mengambil info pembayaran:", err);
        res.status(500).json({ success: false, message: "Terjadi kesalahan" });
    }
};


module.exports = {
    createTransaction,
    handlePaymentNotification,
    validateMidtransWebhook,
    getProgramPurchaseByUserId,
    getPreloadPayment,
    getProgramPurchaseAll
}; 