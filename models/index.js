// models/index.js
const sequelize = require('../config/dbConfig.js');
const Sequelize = require('sequelize');

const Programs = require('./Programs.js');
const Program_Type = require('./Program_Type.js');
const ProgramMateri = require('./ProgramMateri.js');
const ProgramProspek = require('./ProgramProspek.js');
const ProgramPengajar = require('./ProgramPengajar.js');
const ProgramPurchase = require('./ProgramPurchase.js');

const Materi = require('./Materi.js');
const Prospek = require('./Prospek.js');
const Pengajar = require('./Pengajar.js');
const User = require('./User.js');
const Chapters = require('./Chapters.js');
const UserProgress = require('./UserProgress.js');
const Attachments = require('./Attachments.js');
const Certificates = require('./Certificates.js');
const Notifications = require('./Notifications.js');
const Admin = require('./Admin.js');

// Mengautentikasi ke database
sequelize.authenticate()
  .then(() => {
    console.log('Connected...');
  })
  .catch(err => {
    console.error('Error:', err);
  });

const db = {};

// Mengimpor model dan menambahkan ke db
db.Program = Programs;
db.Program_Type = Program_Type;
db.ProgramMateri = ProgramMateri;
db.ProgramProspek = ProgramProspek;
db.ProgramPengajar = ProgramPengajar;
db.ProgramPurchase = ProgramPurchase;

db.Materi = Materi;
db.Prospek = Prospek;
db.Pengajar = Pengajar;
db.User = User;
db.Chapters = Chapters;
db.UserProgress = UserProgress;
db.Attachments = Attachments;
db.Certificates = Certificates;
db.Notifications = Notifications;
db.Admin = Admin;

// Set up Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log(`Asosiasi untuk model ${modelName} telah dipanggil.`);
  } else {
    console.log(`Model ${modelName} tidak memiliki asosiasi.`);
  }
});

// Menambahkan properti Sequelize dan sequelize ke objek db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false })
  .then(() => {
    console.log("yes re-sync done!");
  });

module.exports = db;
