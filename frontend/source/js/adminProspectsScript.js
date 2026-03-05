async function loadProspectsTable() {
  try {
    const res = await fetch('/prospek/all');
    const result = await res.json();
    if (!result.success) {
      console.warn('Tidak ada data pembayaran ditemukan.');
      return;
    }

    const tbody = document.querySelector('#prospectsTable tbody');
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
        document.getElementById('prospect_id').value = id;
        document.querySelector('input[name="prospect_name"]').value = nama;

        // Set flag editing
        const form = document.getElementById('prospectForm');
        form.dataset.editing = 'true';

        // Ubah judul modal
        document.getElementById('prospectModalLabel').innerText = 'Edit Prospect';

        // Tampilkan modal
        prospectModal.show();
      });

      // Event Delete
      row.querySelector('.btn-delete').addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Are you sure want to delete this prospect?')) {
          try {
            const res = await fetch(`/prospek/delete/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
              alert('Prospect deleted');
              loadProspectsTable();
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
    if (!document.querySelector('#prospectsTable').classList.contains('dt-loaded')) {
      new DataTable('#prospectsTable', {
        order: [[0, 'asc']]
      });
      document.querySelector('#prospectsTable').classList.add('dt-loaded');
    }

  } catch (error) {
    console.error('Gagal memuat data:', error);
  }
};

const prospectModalEl = document.getElementById('prospectModal');
const prospectModal = new bootstrap.Modal(prospectModalEl);
document.getElementById('btnAddProspect').addEventListener('click', async () => {
  // reset form
  document.getElementById('prospectForm').reset();
  delete document.getElementById('prospectForm').dataset.editing;
  document.getElementById('prospectModalLabel').innerText = 'Add Prospect';

  prospectModal.show();
});

async function addProspek(e) {
  e.preventDefault();

  const form = e.target;
  const nama = form.prospect_name.value;
  const isEditing = form.dataset.editing === 'true';

  let endpoint = '';
  let method = '';
  let bodyData = null;

  if (isEditing) {
    const id = document.getElementById('prospect_id').value;
    endpoint = `/prospek/update/${id}`;
    method = 'PATCH';
    bodyData = { nama };
  } else {
    endpoint = '/prospek/create';
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
      alert(isEditing ? 'Prospect updated!' : 'Prospect added!');
      prospectModal.hide();

      form.reset();
      delete form.dataset.editing;

      document.getElementById('prospectModalLabel').innerText = 'Add Prospect';

      loadProspectsTable();
    } else {
      alert('Gagal menyimpan prospect: ' + result.message);
    }
  } catch (error) {
    console.error('Error saat simpan prospect:', error);
    alert('Terjadi kesalahan');
  }
};


//Running it
loadProspectsTable();
document.getElementById('prospectForm').addEventListener('submit', addProspek);