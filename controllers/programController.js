const db = require('../models/index.js');
const fs = require('fs');

// Create main Model
const Program = db.Program;
const Materi = db.Materi;
const Prospek = db.Prospek;
const Pengajar = db.Pengajar;
const Program_Type = db.Program_Type;
const Chapters = db.Chapters;

// Get all Coorporates
const getAllCoorporates = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 1
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
};

// Get 3 Coorporates
const get3Coorporates = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 1
            },
            limit: 3,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
};

// Get Coorporate by ID
const getCoorporateById = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findByPk(id, {
            where: {
                type: 1
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'],
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = {
            id: program.id,
            type: program.Type,
            gambar: program.gambar,
            nama_program: program.nama_program,
            durasi: program.durasi,
            durasi_jamhari: program.durasi_jamhari,
            harga: program.harga,
            diskon: program.diskon,
            detail: program.detail,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
            materi: program.Materi, 
            prospek: program.Prospek,
            pengajar: program.Pengajar,
        };
        
        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Coorporate by ID API',
            error: error.message,
        });
    }
};

// Get all Short Courses
const getAllShortCourses = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 2
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedShortCourses = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedShortCourses) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedShortCourses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All ShortCourses API',
            error: error.message,
        });
    }
};

// Get 3 Short Courses
const get3ShortCourses = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 2
            },
            limit: 3,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedShortCourses = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedShortCourses) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedShortCourses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All ShortCourses API',
            error: error.message,
        });
    }
};

// Get Short Courses by ID
const getShortCoursesById = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findByPk(id, {
            where: {
                type: 2
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'],
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedShortCourses = {
            id: program.id,
            type: program.Type,
            gambar: program.gambar,
            nama_program: program.nama_program,
            durasi: program.durasi,
            durasi_jamhari: program.durasi_jamhari,
            harga: program.harga,
            diskon: program.diskon,
            detail: program.detail,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
            materi: program.Materi, 
            prospek: program.Prospek,
            pengajar: program.Pengajar,
        };
        
        if (!formattedShortCourses) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedShortCourses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Short Courses by ID API',
            error: error.message,
        });
    }
};

// Get all Project-Based
const getAllProjectBased = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 3
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedProjectBased = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedProjectBased) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedProjectBased,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Project Based API',
            error: error.message,
        });
    }
};

// Get 3 Project-Based
const get3ProjectBased = async (req, res) => {
    try {
        const program = await Program.findAll({
            where: {
                type: 3
            },
            limit: 3,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedProjectBased = program.map(program => {
            return {
                id: program.id,
                type: program.Type, // Menambahkan data type ke dalam response
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedProjectBased) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedProjectBased,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Project Based API',
            error: error.message,
        });
    }
};

// Get Project-Based by ID
const getProjectBasedById = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findByPk(id, {
            where: {
                type: 2
            },
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'],
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedProjectBased = {
            id: program.id,
            type: program.Type,
            gambar: program.gambar,
            nama_program: program.nama_program,
            durasi: program.durasi,
            durasi_jamhari: program.durasi_jamhari,
            harga: program.harga,
            diskon: program.diskon,
            detail: program.detail,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
            materi: program.Materi, 
            prospek: program.Prospek,
            pengajar: program.Pengajar,
        };
        
        if (!formattedProjectBased) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedProjectBased,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Project Based by ID API',
            error: error.message,
        });
    }
};

//GET All Programs
const getAllPrograms = async (req, res) => {
    try {
        const program = await Program.findAll({
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'], 
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedCoorporates = program.map(program => {
            return {
                id: program.id,
                type: program.Type,
                gambar: program.gambar,
                nama_program: program.nama_program,
                durasi: program.durasi,
                durasi_jamhari: program.durasi_jamhari,
                harga: program.harga,
                diskon: program.diskon,
                detail: program.detail,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                materi: program.Materi, 
                prospek: program.Prospek,
                pengajar: program.Pengajar,
            };
        });

        if (!formattedCoorporates) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedCoorporates,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
};

// Get Program by ID
const getProgramById = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findByPk(id, {
            include: [
                { model: Materi, through: { attributes: [] }, as: 'Materi' },
                { model: Prospek, through: { attributes: [] }, as: 'Prospek' },
                { model: Pengajar, through: { attributes: [] }, as: 'Pengajar' },
                {
                    model: Program_Type,
                    as: 'Type',
                    attributes: ['id', 'nama'],
                }
            ],
        });

        // Mengubah format data sebelum mengirimkan response
        const formattedProgram = {
            id: program.id,
            type: program.Type,
            gambar: program.gambar,
            nama_program: program.nama_program,
            durasi: program.durasi,
            durasi_jamhari: program.durasi_jamhari,
            harga: program.harga,
            diskon: program.diskon,
            detail: program.detail,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
            materi: program.Materi, 
            prospek: program.Prospek,
            pengajar: program.Pengajar,
        };
        
        if (!formattedProgram) {
            return res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }
        res.status(200).send({
            success: true,
            data: formattedProgram,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Program by ID API',
            error: error.message,
        });
    }
};

// Edit Program 
const editProgram = async (req, res) => {
    const { id } = req.params;
    const {
        type,
        gambar,
        nama_program,
        durasi,
        durasi_jamhari,
        harga,
        diskon,
        detail,
        lessons, prospects, teachers
    } = req.body;

    try {
        const program = await Program.findByPk(id);

        if (!program) {
            return res.status(404).send({
                success: false,
                message: 'Program not found',
            });
        }

        // Cek file gambar
        if (req.file) {
            // Hapus file lama jika ada
            if (program.gambar) {
                const oldPath = path.join(__dirname, '../uploads', program.gambar);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Gambar baru disimpan
            gambarPath = `/uploads/${req.file.filename}`;
        }

        await program.update({
            type: type || program.type,
            gambar: gambarPath,
            nama_program: nama_program || program.nama_program,
            durasi: durasi || program.durasi,
            durasi_jamhari: durasi_jamhari || program.durasi_jamhari,
            harga: harga || program.harga,
            diskon: diskon || program.diskon,
            detail: detail || program.detail,
        });

        if (lessons) {
            const lessonArray = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
            await program.setMateri(lessonArray);
          }
          
          if (prospects) {
            const prospectsArray = typeof prospects === 'string' ? JSON.parse(prospects) : prospects;
            await program.setProspek(prospectsArray);
          }
          
          if (teachers) {
            const teachersArray = typeof teachers === 'string' ? JSON.parse(teachers) : teachers;
            await program.setPengajar(teachersArray);
          }
          

        res.status(200).send({
            success: true,
            message: 'Program updated successfully',
            data: program,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error updating program',
            error: error.message,
        });
    }
};

//GET Program Type
const getProgramsType = async (req, res) => {
    try {
        const type = await Program_Type.findAll();
        res.status(200).send({
            success: true,
            data: type,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
}

// GET All Teachers
const getAllTeachers = async (req, res) => {
    try {
        const teacher = await Pengajar.findAll();
        res.status(200).send({
            success: true,
            data: teacher,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Coorporates API',
            error: error.message,
        });
    }
}

//POST Programs
const createPrograms = async (req, res) => {
    try {
      const { nama_program, type, detail, durasi, harga, diskon, lessons, prospects, teachers } = req.body;
  
      // Cek file gambar
      let gambarPath = null;
      if (req.file) {
        gambarPath = `/uploads/${req.file.filename}`;
      }
  
      // Simpan program utama
      const program = await Program.create({
        nama_program,
        type,
        gambar: gambarPath,
        detail,
        durasi,
        harga,
        diskon,
      });
  
      // Simpan relasi lessons
      const lessonsArray = JSON.parse(lessons);
      for (const lesson of lessonsArray) {
        await program.addMateri(lesson);
      }
  
      // Simpan relasi prospects
      const prospectsArray = JSON.parse(prospects);
      for (const prospect of prospectsArray) {
        await program.addProspek(prospect);
      }
  
      // Simpan relasi teachers
      const teachersArray = JSON.parse(teachers);
      for (const teacher of teachersArray) {
        await program.addPengajar(teacher);
      }
  
      res.status(201).send({
        success: true,
        message: 'Program created successfully!',
        data: program,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error creating program',
        error: error.message,
      });
    }
};
  
//DELETE Program
const deleteProgram = async (req, res) => {
    const { id } = req.params;

    try {
        const program = await Program.findByPk(id);

        if (!program) {
            return res.status(404).send({
                success: false,
                message: 'Program not found',
            });
        }

        // Hapus relasi jika ada
        await program.setMateri([]);  // Hapus relasi materi
        await program.setProspek([]); // Hapus relasi prospek
        await program.setPengajar([]); // Hapus relasi pengajar

        // Hapus semua chapter terkait (kalau pakai relasi manual)
        await Chapters.destroy({ where: { id_programs: id } });

        // Hapus programnya
        await program.destroy();

        res.status(200).send({
            success: true,
            message: 'Program deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting program',
            error: error.message,
        });
    }
};

module.exports = {
    getAllCoorporates,
    get3Coorporates,
    getCoorporateById,
    getAllShortCourses,
    get3ShortCourses,
    getShortCoursesById,
    getAllProjectBased,
    get3ProjectBased,
    getProjectBasedById,
    getAllPrograms,
    getProgramById,
    getProgramsType,
    getAllTeachers,
    createPrograms,
    editProgram,
    deleteProgram,
};
