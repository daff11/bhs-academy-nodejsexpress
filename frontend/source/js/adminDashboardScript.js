async function loadDashboardSummary() {
    try {
      // Total Program
      const programRes = await fetch('/program/all');
      const programData = await programRes.json();
      document.getElementById('totalPrograms').textContent = programData.data?.length || 0;
  
      // Total Teacher
      const teacherRes = await fetch('/teacher/getall');
      const teacherData = await teacherRes.json();
      document.getElementById('totalTeachers').textContent = teacherData.data?.length || 0;
  
      // Total User
      const userRes = await fetch('/user/getall'); // HARUS BUAT ENDPOINT GET ALL USER, bukan hanya yang login
      const userData = await userRes.json();
      document.getElementById('totalUsers').textContent = userData.data?.length || 0;
  
    } catch (err) {
      console.error('Error loading summary:', err);
    }
}

async function loadPurchaseChart() {
    try {
      const res = await fetch('/program/purchasedall');
      const result = await res.json();
      if (!result.success) return;
  
      const data = result.data;
  
      // === Ambil tanggal terbaru dari pembelian ===
      const latestDate = data.reduce((latest, curr) => {
        const currDate = new Date(curr.programPurchaseDate);
        return currDate > latest ? currDate : latest;
      }, new Date(0)); // Mulai dari epoch
  
      const formattedDate = latestDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      document.getElementById('updatedAtLabel').textContent = `Updated at ${formattedDate}`;
  
      // === Hitung total pembelian per program ===
      const countsByProgram = {};
      data.forEach(p => {
        const name = p.programPurchaseName;
        countsByProgram[name] = (countsByProgram[name] || 0) + 1;
      });
  
      const labels = Object.keys(countsByProgram);
      const values = Object.values(countsByProgram);
  
      renderPurchaseChart(labels, values);
    } catch (error) {
      console.error('Error loading chart:', error);
    }
}  
  
let purchaseChart;
function renderPurchaseChart(labels, values) {
    const ctx = document.getElementById('purchaseChart').getContext('2d');

    if (purchaseChart) {
        purchaseChart.destroy();
    }

    purchaseChart = new Chart(ctx, {
        type: 'pie',
        data: {
        labels: labels,
        datasets: [{
            label: 'Total',
            data: values,
            backgroundColor: [
            '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e',
            '#e74a3b', '#858796', '#5a5c69'
            ],
            borderWidth: 1
        }]
        },
        options: {
        responsive: true,
        plugins: {
            legend: {
            position: 'bottom'
            }
        }
        }
    });
}
  
  