async function loadPaymentsTable() {
  try {
    const res = await fetch('/program/purchasedall');
    const result = await res.json();
    if (!result.success) {
      console.warn('Tidak ada data pembayaran ditemukan.');
      return;
    }

    const tbody = document.querySelector('#paymentsTable tbody');
    tbody.innerHTML = ''; // Kosongkan dulu

    result.data.forEach((item) => {
      const row = document.createElement('tr');

      const price = `Rp ${Number(item.programPurchaseHarga).toLocaleString('id-ID')}`;
      let statusClass = '';
      if (item.programStatus === 'completed') {
        statusClass = 'bg-success text-white';
      } else if (item.programStatus === 'pending') {
        statusClass = 'bg-warning text-white';
      } else if (item.programStatus === 'cancelled') {
        statusClass = 'bg-grey text-white';
      }

      const date = new Date(item.programPurchaseDate);
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
      const purchaseDate = `${formattedDate} ${formattedTime}`;
      

      row.innerHTML = `
        <td>${item.programPurchaseName}</td>
        <td>${price}</td>
        <td>${item.programUser || '-'}</td>
        <td>${item.programPurchaseType}</td>
        <td><span class="badge ${statusClass}">${item.programStatus}</span></td>
        <td data-order="${new Date(item.programPurchaseDate).toISOString()}">${purchaseDate}</td>
      `;

      tbody.appendChild(row);
    });

    // Inisialisasi DataTables jika belum
    if (!document.querySelector('#paymentsTable').classList.contains('dt-loaded')) {
      new DataTable('#paymentsTable', {
        order: [[5, 'desc']]
      });
      document.querySelector('#paymentsTable').classList.add('dt-loaded');
    }

  } catch (error) {
    console.error('Gagal memuat data pembayaran:', error);
  }
}
