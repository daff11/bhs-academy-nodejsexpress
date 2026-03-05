/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

async function loadTeachersTable() {
  try {
    const res = await fetch('/pengajar/getall');
    const result = await res.json();
    if (!result.success) {
      console.warn('No data has been found');
      return;
    }

    const tbody = document.querySelector('#teachersTable tbody');
    tbody.innerHTML = ''; // Kosongkan dulu

    result.data.forEach((item) => {
      const row = document.createElement('tr');

      const date = new Date(item.createdAt);
      const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const teacherCreatedISO = date.toISOString();
      const teacherCreatedDisplay = `${formattedDate} ${formattedTime}`;
      

      row.innerHTML = `
        <td>
          <button class="btn btn-sm btn-danger text-white" title="Delete Program">
            <i class="fa fa-trash"></i>
          </button>
        </td>
        <td>${item.fullname}</td>
        <td>${item.email}</td>
        <td>${item.jabatan}</td>
        <td data-order="${teacherCreatedISO}">${teacherCreatedDisplay}</td>
      `;

      tbody.appendChild(row);
    });

    // Inisialisasi DataTables jika belum
    if (!document.querySelector('#teachersTable').classList.contains('dt-loaded')) {
      new DataTable('#teachersTable', {
        order: [[4, 'desc']]
      });
      document.querySelector('#teachersTable').classList.add('dt-loaded');
    }

  } catch (error) {
    console.error('Gagal memuat data pembayaran:', error);
  }
}

async function deleteTeachers() {
  
}

//Running it
loadTeachersTable();