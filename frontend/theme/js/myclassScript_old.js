/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Ambil data dari API
        const response = await fetch('/payment/getprogramuserid');
        const result = await response.json();

        const container = document.querySelector('#class .row');

        if (!result.success || !result.data.length) {
        // Jika tidak ada program yang dibeli atau terjadi kesalahan
        container.innerHTML = `
            <div class="col-12 text-center">
            <p class="text-muted">Kamu belum memiliki Program apapun.</p>
            </div>
        `;
        return;
        }
  
        // Bersihkan konten lama jika ada
        container.innerHTML = '';

        // Tambahkan data program ke dalam tab "My Class"
        result.data.forEach((program) => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4'); // Bootstrap grid styling

        card.innerHTML = `
            <div class="card p-0 border-primary rounded-lg hover-shadow" style="max-width: 100%;">
                <div style="position: relative;">
                    <img class="card-img-top img-course-thumb-mini" src="${program.programPurchaseGambar}" alt="${program.programPurchaseName}">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 8px 12px; background: rgba(0, 0, 0, 0.5); color: white;">
                    <span class="card-bottom"><a class="text-white" href="/program/coorporate"><strong>${program.programPurchaseType}</strong></a></span>
                    </div>
                </div>
                <div class="card-body">
                    <a href="/program/coorporate/single?id=${program.programPurchaseId}">
                    <h5 class="card-title" style="font-size: 16px;">${program.programPurchaseName}</h5>
                    </a>
                    <p style="font-size: 14px; text-align: left;">${truncateText(program.programPurchaseDetail, 8)}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
      });
    } catch (error) {
        console.error('Error loading My Class data:', error);

        // Tampilkan pesan kesalahan
        const container = document.querySelector('#class .row');
        container.innerHTML = `
            <div class="col-12 text-center">
            <p class="text-danger">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>
            </div>
        `;
    }
});
  