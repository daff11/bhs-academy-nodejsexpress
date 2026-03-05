/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

async function loadLessonsTable() {
  try {
    const res = await fetch('/materi/all');
    const result = await res.json();
    if (!result.success) {
      console.warn('Tidak ada data pembayaran ditemukan.');
      return;
    }

    const tbody = document.querySelector('#lessonsTable tbody');
    tbody.innerHTML = '';

    result.data.forEach((item, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>
          <button class="btn btn-sm btn-warning text-white btn-edit" data-id="${item.id}" data-nama="${item.nama}">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger text-white btn-delete" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(row);

      // Event Edit
      row.querySelector('.btn-edit').addEventListener('click', (e) => {
        const button = e.currentTarget;
        const id = button.dataset.id;
        const nama = button.dataset.nama;

        // Isi field form
        document.getElementById('lesson_id').value = id;
        document.querySelector('input[name="lesson_name"]').value = nama;

        // Set flag editing
        const form = document.getElementById('lessonForm');
        form.dataset.editing = 'true';

        // Ubah judul modal
        document.getElementById('lessonModalLabel').innerText = 'Edit Lesson';

        // Tampilkan modal
        lessonModal.show();
      });

      // Event Delete
      row.querySelector('.btn-delete').addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Yakin ingin menghapus lesson ini?')) {
          try {
            const res = await fetch(`/materi/delete/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
              alert('Lesson deleted');
              loadLessonsTable();
            } else {
              alert('Error while deleting: ' + result.message);
            }
          } catch (err) {
            alert('Terjadi kesalahan saat menghapus');
            console.error(err);
          }
        }
      });

    });

    // Inisialisasi DataTables jika belum
    if (!document.querySelector('#lessonsTable').classList.contains('dt-loaded')) {
      new DataTable('#lessonsTable', {
        order: [[0, 'asc']]
      });
      document.querySelector('#lessonsTable').classList.add('dt-loaded');
    }

  } catch (error) {
    console.error('Gagal memuat data:', error);
  }
};

const lessonModalEl = document.getElementById('lessonModal');
const lessonModal = new bootstrap.Modal(lessonModalEl);
document.getElementById('btnAddLesson').addEventListener('click', async () => {
  // reset form
  document.getElementById('lessonForm').reset();
  delete document.getElementById('lessonForm').dataset.editing;
  document.getElementById('lessonModalLabel').innerText = 'Add Lesson';

  lessonModal.show();
});

async function addMateri(e) {
  e.preventDefault();

  const form = e.target;
  const nama = form.lesson_name.value;
  const isEditing = form.dataset.editing === 'true';

  let endpoint = '';
  let method = '';
  let bodyData = null;

  if (isEditing) {
    const id = document.getElementById('lesson_id').value;
    endpoint = `/materi/update/${id}`;
    method = 'PATCH';
    bodyData = { nama };
  } else {
    endpoint = '/materi/create';
    method = 'POST';
    bodyData = { nama };
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const result = await res.json();
    if (result.success) {
      alert(isEditing ? 'Lesson updated!' : 'Lesson added!');
      lessonModal.hide();

      form.reset();
      delete form.dataset.editing;

      document.getElementById('lessonModalLabel').innerText = 'Add Lesson';

      loadLessonsTable();
    } else {
      alert('Gagal menyimpan lesson: ' + result.message);
    }
  } catch (error) {
    console.error('Error saat simpan lesson:', error);
    alert('Terjadi kesalahan');
  }
};


//Running it
loadLessonsTable();
document.getElementById('lessonForm').addEventListener('submit', addMateri);