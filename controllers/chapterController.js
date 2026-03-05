const db = require('../models/index.js');
const { Chapters, Attachments, UserProgress, Program, User } = db;

// GET Chapters by Program ID
const getChaptersByProgramId = async (req, res) => {
    const { programId } = req.params;
    try {
        const chapters = await Chapters.findAll({
            where: { id_programs: programId }, 
            include: [
                {
                    model: Attachments,
                    as: 'Attachments',
                    attributes: ['id', 'file_name', 'file_path']
                },
                {
                    model: UserProgress,
                    as: 'Progress',
                    attributes: ['id_user', 'is_completed', 'completed_at']
                },
                {
                    model: Program,
                    as: 'Program',
                    attributes: ['id', 'nama_program']
                }
            ]
        });

        if (!chapters.length) {
            return res.status(404).send({
                success: false,
                message: 'No chapters found for this program',
            });
        }

        // Format data response
        const formattedChapters = chapters.map(chapter => ({
            id: chapter.id,
            id_programs: chapter.id_programs,
            title: chapter.title,
            content: chapter.content,
            video_path: chapter.video_path,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
            program: chapter.Program ? chapter.Program.nama_program : null,
            attachments: chapter.Attachments || [],
            progress: chapter.Progress || []
        }));

        res.status(200).send({
            success: true,
            data: formattedChapters,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Chapters by Program ID API',
            error: error.message,
        });
    }
};

// Update Chapter
const replaceChapters = async (req, res) => {
    const { id_programs, chapters } = req.body;

    try {
        // Hapus chapter lama
        await Chapters.destroy({
            where: { id_programs }
        });

        // Tambahkan chapter baru
        const inserted = await Chapters.bulkCreate(
            chapters.map(chap => ({
                id_programs,
                title: chap.title,
                content: chap.content,
                video_path: chap.video_path,
            }))
        );

        res.status(200).send({
            success: true,
            message: 'Chapters replaced successfully',
            data: inserted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error replacing chapters',
            error: error.message,
        });
    }
};

// Create
const createChapters = async (req, res) => {
    try {
        const { id_programs, chapters } = req.body;

        if (!id_programs || !Array.isArray(chapters) || !chapters.length) {
            return res.status(400).send({
                success: false,
                message: 'Program ID and chapters data are required and should not be empty.',
            });
        }

        const createdChapters = await Promise.all(
            chapters.map(async (chapter) => {
                return await Chapters.create({
                    id_programs: id_programs,
                    title: chapter.title,
                    content: chapter.content,
                    video_path: chapter.video_path || null,
                });
            })
        );

        res.status(201).send({
            success: true,
            message: 'Chapters created successfully!',
            data: createdChapters,
        });

    } catch (error) {
        console.error('Error creating chapters:', error);
        res.status(500).send({
            success: false,
            message: 'Error in create chapters API',
            error: error.message,
        });
    }
};

// POST Mark Chapter as Complete
const markChapterAsComplete = async (req, res) => {
    const { chapterId } = req.body;
    const userId = req.session.userId;

    try {
        // Cek apakah chapter memiliki id_program
        const chapter = await Chapters.findOne({
            where: { id: chapterId },
            include: {
                model: Program,
                as: 'Program',
                attributes: ['id']
            }
        });
        if (!chapter) {
            return res.status(404).send({
                success: false,
                message: 'Chapter not found'
            });
        }

        const programId = chapter.id_program || (chapter.Program ? chapter.Program.id : null);
        if (!programId) {
            return res.status(400).send({
                success: false,
                message: 'Program ID not found for this chapter'
            });
        }

        // Cek apakah progress sudah ada
        let progress = await UserProgress.findOne({
            where: { id_user: userId, id_chapter: chapterId }
        });

        if (progress) {
            // Jika sudah selesai, kirim respon tanpa mengupdate ulang
            if (progress.is_completed) {
                return res.status(400).send({
                    success: false,
                    message: 'Chapter already marked as complete.'
                });
            }

            // Update progress jika belum selesai
            progress.is_completed = true;
            progress.completed_at = new Date();
            await progress.save();
        } else {
            // Jika belum ada, buat progress baru
            progress = await UserProgress.create({
                id_user: userId,
                id_chapter: chapterId,
                id_program: programId,
                is_completed: true,
                completed_at: new Date()
            });
        }

        res.status(200).send({
            success: true,
            message: 'Chapter marked as complete successfully.',
            data: progress
        });

    } catch (error) {
        console.error('Error marking chapter as complete:', error);
        res.status(500).send({
            success: false,
            message: 'Error in marking chapter as complete.',
            error: error.message
        });
    }
};

module.exports = { getChaptersByProgramId, markChapterAsComplete, createChapters, replaceChapters };
