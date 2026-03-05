/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

async function getChaptersCount(programId) {
    try {
        const response = await fetch(`/user/myclass/chapter/${programId}`);
        if (!response.ok) {
            return 0;
        }

        const result = await response.json();
        if (result.success) {
            return result.data.length;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(`Error fetching chapters for program ${programId}:`, error);
        return 0;
    }
}

async function getPrograms() {
    try {
        const response = await fetch('/program/all');
        const result = await response.json();

        if (result.success) {
            const programs = result.data;

            // Ambil semua count chapters paralel
            const chaptersCounts = await Promise.all(
                programs.map(program => getChaptersCount(program.id))
            );

            const tableData = programs.map((program, index) => {
                return {
                    actions: `
                        <button class="btn btn-sm btn-warning mb-10" title="Edit Program" onclick="editProgramPage(${program.id})">
                            <i class="fa fa-edit"></i>
                        </button> <br>
                        <button class="btn btn-sm btn-danger" title="Delete Program" onclick="deleteProgram(${program.id})">
                            <i class="fa fa-trash"></i>
                        </button>
                    `,
                    programName: program.nama_program,
                    type: program.type ? program.type.nama : 'N/A',
                    image: program.gambar ? `<img src="${program.gambar}" alt="Program Image" style="width: 80px; height: auto;">` : 'No Image',
                    detail: program.detail ? program.detail.split(' ').slice(0, 10).join(' ') + '...' : 'No Details',
                    duration: program.durasi,
                    price: program.harga ? `Rp ${Number(program.harga).toLocaleString('id-ID')}` : 'Rp 0',
                    discount: program.diskon !== null ? program.diskon + '%' : '-',
                    lessons: program.materi ? program.materi.map(lesson => lesson.title).join(', ') : 'No Lessons',
                    teachers: program.pengajar ? program.pengajar.map(teacher => teacher.name).join(', ') : 'No Teachers',
                    prospects: program.prospek ? program.prospek.map(prospect => prospect.name).join(', ') : 'No Prospects',
                    chapters: chaptersCounts[index] || 0
                };
            });

            // Menggunakan DataTables tanpa jQuery
            const table = document.querySelector('#programsTable');
            if (table) {
                new DataTable(table, {
                    data: tableData,
                    columns: [
                        { data: 'actions' },
                        { data: 'programName' },
                        { data: 'type' },
                        { data: 'image' },
                        { data: 'detail' },
                        { data: 'price' },
                        { data: 'discount' },
                        { data: 'chapters' }
                    ],
                    destroy: true,
                });
            }
        } else {
            console.error('Failed to load programs:', result.message);
        }
    } catch (error) {
        console.error('Error fetching programs:', error);
    }
}

async function addPrograms() {
    const hargaField = document.getElementById('hargaField');
    const cleanedHarga = hargaField.value.replace(/\./g, '');
    hargaField.value = cleanedHarga;

    const programForm = document.getElementById('programForm');
    const formData = new FormData(programForm);

    // Ambil data lessons, prospects, dan teachers dari form dinamis
    const lessons = Array.from(document.querySelectorAll('select[name="lessons[]"]')).map(select => select.value);
    const prospects = Array.from(document.querySelectorAll('select[name="prospects[]"]')).map(select => select.value);
    const teachers = Array.from(document.querySelectorAll('select[name="teachers[]"]')).map(select => select.value);
    const fileInput = document.getElementById('gambarUpload');
    if (fileInput && fileInput.files[0] && fileInput.files[0].size > 4 * 1024 * 1024) {
        alert('File gambar maksimal 4MB');
        return;
    }

    // Tambahkan data lessons, prospects, dan teachers ke FormData
    formData.append('lessons', JSON.stringify(lessons));
    formData.append('prospects', JSON.stringify(prospects));
    formData.append('teachers', JSON.stringify(teachers));

    // Kirim data ke backend untuk menyimpan program
    try {
        const response = await fetch('/program/addprogram', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert('Program created successfully!');
            const newProgramId = result.data.id; // Pastikan API-mu kirim id program baru

            if (chaptersData.length) {
                await addChapters(newProgramId); // Tambahkan chapters setelah program dibuat
                window.location.href = '/admin/programs';
            } else {
                window.location.href = '/admin/programs';
            }

            programForm.reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating program:', error);
        alert('Failed to create program');
    }
}

function editProgramPage(programId) {
    window.location.href = `/program/edit/${programId}`;
}

async function editPrograms(programId) {
    const hargaField = document.getElementById('hargaField');
    const cleanedHarga = hargaField.value.replace(/\./g, '');
    hargaField.value = cleanedHarga;

    const programForm = document.getElementById('programForm');
    const formData = new FormData(programForm);

    const lessons = Array.from(document.querySelectorAll('select[name="lessons[]"]')).map(select => select.value);
    const prospects = Array.from(document.querySelectorAll('select[name="prospects[]"]')).map(select => select.value);
    const teachers = Array.from(document.querySelectorAll('select[name="teachers[]"]')).map(select => select.value);
    if (programId) {
        document.getElementById('gambarUpload').required = false;
      }

    formData.append('lessons', JSON.stringify(lessons));
    formData.append('prospects', JSON.stringify(prospects));
    formData.append('teachers', JSON.stringify(teachers));

    try {
        const response = await fetch(`/program/editprogram/${programId}`, {
            method: 'PUT',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert('Program updated successfully!');
            if (chaptersData.length) {
                await replaceChapters(programId);
            }
            window.location.href = '/admin/programs';
        } else {
            alert('Error updating program: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating program:', error);
        alert('Failed to update program.');
    }
}

async function deleteProgram(programId) {
    if (!confirm('Apakah kamu yakin ingin menghapus program ini beserta materi, prospects, teachers, dan chapters-nya?')) {
        return;
    }

    try {
        const response = await fetch(`/program/delete/${programId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            alert('Program berhasil dihapus.');
            getPrograms(); // Refresh table
            window.location.href = '/admin/programs';
        } else {
            alert('Gagal menghapus program: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting program:', error);
        alert('Terjadi kesalahan saat menghapus program.');
    }
}

async function loadProgramData(programId) {
    try {
        const response = await fetch(`/program/getbyid/${programId}`);
        const result = await response.json();

        if (result.success) {
            const program = result.data;

            document.querySelector('input[name="nama_program"]').value = program.nama_program;
            document.querySelector('select[name="type"]').value = program.type.id; 
            document.querySelector('textarea[name="detail"]').value = program.detail;
            document.querySelector('input[name="durasi"]').value = program.durasi;
            document.querySelector('input[name="harga"]').value = program.harga;
            document.querySelector('input[name="diskon"]').value = program.diskon;

            // cek klo gambar ada di DB
            if (program.gambar) {
            const filename = program.gambar.split(/[/\\]/).pop();
            document.getElementById('gambarLabel').innerText = filename;
            const previewImg = document.getElementById('previewImage');
            previewImg.src = program.gambar;
            previewImg.style.display = 'block';
            }

            // Set lessons, teachers, prospects
            program.materi.forEach(materi => createDropdownWithSelected('lessonsContainer', window.lessonsData, 'lessons[]', materi.id));
            program.pengajar.forEach(teacher => createDropdownWithSelected('teachersContainer', window.teachersData, 'teachers[]', teacher.id));
            program.prospek.forEach(prospek => createDropdownWithSelected('prospectsContainer', window.prospectsData, 'prospects[]', prospek.id));

            // Fetch chapters secara terpisah
            const chapterResponse = await fetch(`/program/chapter/${programId}`);
            const chapterResult = await chapterResponse.json();

            if (chapterResult.success) {
                chaptersData = chapterResult.data.map(chapter => ({
                    id: chapter.id,
                    title: chapter.title,
                    video_path: chapter.video_path,
                    content: chapter.content
                }));
            } else {
                chaptersData = [];
            }

            updateChaptersView();
        } else {
            alert('Program tidak ditemukan.');
        }
    } catch (error) {
        console.error('Error loading program data:', error);
    }
}

async function loadProgramTypes() {
    try {
        const response = await fetch('/program/alltype');
        const result = await response.json();

        if (result.success) {
            const types = result.data;
            const typeSelect = document.querySelector('select[name="type"]');  // Pastikan elemen dropdown sudah ada di HTML

            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;  // Atur value dengan id type
                option.textContent = type.nama;  // Tampilkan nama type
                typeSelect.appendChild(option);
            });
        } else {
            console.error('Failed to load program types:', result.message);
        }
    } catch (error) {
        console.error('Error fetching program types:', error);
    }
}

async function loadLessons() {
    try {
        const response = await fetch('/materi/all'); // sesuaikan route API-mu
        const result = await response.json();

        if (result.success) {
            window.lessonsData = result.data; // Simpan global biar bisa dipakai untuk setiap select baru
        } else {
            console.error('Failed to load lessons:', result.message);
        }
    } catch (error) {
        console.error('Error loading lessons:', error);
    }
}

async function loadProspects() {
    try {
        const response = await fetch('/prospek/all'); // sesuaikan route API-mu
        const result = await response.json();

        if (result.success) {
            window.prospectsData = result.data;
        } else {
            console.error('Failed to load prospects:', result.message);
        }
    } catch (error) {
        console.error('Error loading prospects:', error);
    }
}

async function loadTeachers() {
    try {
        const response = await fetch('/pengajar/getall'); // sesuaikan route API-mu
        const result = await response.json();

        if (result.success) {
            window.teachersData = result.data; // Simpan global biar bisa dipakai untuk setiap select baru
        } else {
            console.error('Failed to load lessons:', result.message);
        }
    } catch (error) {
        console.error('Error loading lessons:', error);
    }
}

function createDropdownWithActions(containerId, dataArray, nameAttr) {
    const container = document.getElementById(containerId);

    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';

    const select = document.createElement('select');
    select.className = 'form-control me-2';
    select.name = nameAttr;
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select...';
    select.appendChild(defaultOption);

    dataArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nama || item.fullname;
        select.appendChild(option);
    });

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-success btn-sm me-1';
    saveBtn.innerHTML = '<i class="fa fa-save"></i>';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    saveBtn.addEventListener('click', function () {
        if (saveBtn.dataset.mode === 'edit') {
            select.disabled = true;
            saveBtn.innerHTML = '<i class="fa fa-edit btn-warning"></i>';
            saveBtn.dataset.mode = 'save';
        } else {
            select.disabled = true;
            saveBtn.innerHTML = '<i class="fa fa-edit btn-warning"></i>';
            saveBtn.dataset.mode = 'edit';
        }
    });

    deleteBtn.addEventListener('click', function () {
        container.removeChild(div);
    });

    div.appendChild(select);
    div.appendChild(saveBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
}

function createDropdownWithSelected(containerId, dataArray, nameAttr, selectedId) {
    const container = document.getElementById(containerId);

    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';

    const select = document.createElement('select');
    select.className = 'form-control me-2';
    select.name = nameAttr;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select...';
    select.appendChild(defaultOption);

    dataArray.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nama || item.fullname;
        if (item.id == selectedId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.disabled = true; // default disabled

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn-warning btn-sm me-1';
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    editBtn.addEventListener('click', function () {
        select.disabled = !select.disabled;
        editBtn.innerHTML = select.disabled ? '<i class="fa fa-edit"></i>' : '<i class="fa fa-save"></i>';
    });

    deleteBtn.addEventListener('click', function () {
        container.removeChild(div);
    });

    div.appendChild(select);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
}

async function addChapters(programId) {
    try {
        if (!programId) {
            alert('Program ID tidak ditemukan.');
            return;
        }

        if (!chaptersData.length) {
            alert('Tidak ada chapter yang ditambahkan.');
            return;
        }

        const payload = {
            id_programs: programId,
            chapters: chaptersData, // chaptersData sudah array of {title, content, video_path}
        };

        const response = await fetch('/program/addchapter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
            alert('Chapters berhasil ditambahkan!');
        } else {
            alert('Gagal tambah chapters: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding chapters:', error);
        alert('Error menambahkan chapters.');
    }
}

function updateChaptersView() {
    const container = document.getElementById('chaptersContainer');
    container.innerHTML = '';

    chaptersData.forEach((chapter, index) => {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center justify-content-between bg-white p-2 mb-2 rounded shadow-sm';
        div.innerHTML = `
            <div>${index + 1}. ${chapter.title}</div>
            <div>
                <button type="button" class="btn btn-warning btn-sm me-2" onclick="editChapter(${index})">
                    <i class="fa fa-edit"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteChapter(${index})">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function editChapter(index) {
    const chapter = chaptersData[index];
    const form = document.getElementById('chapterForm');

    // Prefill form modal dengan data chapter
    form.chapter_title.value = chapter.title;
    form.chapter_video_path.value = chapter.video_path;
    form.chapter_content.value = chapter.content;

    editingChapterIndex = index; // Simpan index chapter yang mau diedit
    showChapterModal(); // Buka modal
}

async function replaceChapters(programId) {
    const payload = {
        id_programs: programId,
        chapters: chaptersData
    };

    const response = await fetch(`/program/replacechapters/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!result.success) {
        alert('Gagal update chapters: ' + result.message);
    }
}

function deleteChapter(index) {
    if (confirm('Hapus chapter ini?')) {
        chaptersData.splice(index, 1);
        updateChaptersView();
    }
}

function handleProgramSubmit(e) {
    e.preventDefault();

    const pathParts = window.location.pathname.split('/');
    const programId = pathParts.includes('edit') ? pathParts[pathParts.length - 1] : null;

    if (programId) {
        editPrograms(programId);
    } else {
        addPrograms();
    }
}
  
function showChapterModal() {
    chapterModal.show();
}

function handleChapterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const title = form.chapter_title.value.trim();
    const video_path = form.chapter_video_path.value.trim();
    const content = form.chapter_content.value.trim();

    if (!title) {
        alert('Title is required.');
        return;
    }

    const chapter = { title, video_path, content };

    if (editingChapterIndex !== null) {
        // Mode edit
        chaptersData[editingChapterIndex] = chapter;
        editingChapterIndex = null; // Reset mode edit
    } else {
        // Mode tambah baru
        chaptersData.push(chapter);
    }

    updateChaptersView();

    // Tutup modal
    chapterModal.hide();

    // Reset form
    form.reset();
} 