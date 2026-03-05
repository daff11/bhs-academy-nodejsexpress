/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

// Check Status Session
async function isUserLoggedIn() {
    try {
        const response = await fetch('/user/check-status');
        const data = await response.json();
        return data.loggedIn;
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
}

//Check Program User
async function getUserPurchasedPrograms() {
    try {
        const response = await fetch('/payment/getprogramuserid');
        const result = await response.json();

        if (result.success) {
            console.log("Purchased Programs:", result.data); // Debugging
            return result.data; // Berisi daftar program yang user sudah beli
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching purchased programs:', error);
        return [];
    }
}

//handle Button Join Now
function handleJoinNowCoorporate(programId) {
    console.log(`handleJoinNow called with programId: ${programId}`); // Debug log

    fetch('/auth/check-status', {
        credentials: 'include', // Pastikan cookies dikirim
    })
    .then(response => {
        console.log(response.status); // Cek status code response
        if (response.status === 401) {
            console.log('User not authenticated, showing login modal');
            $('#loginModal').modal('show');
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.loggedIn) {
            window.location.href = `/program/payment-details?id=${programId}`;
        }
    })
    .catch(error => console.error('Error in handleJoinNow:', error));        
}

// GET AllCoorporates
async function getAllCoorporates() {
    let purchasedPrograms = [];

    if (await isUserLoggedIn()) {
        purchasedPrograms = await getUserPurchasedPrograms();
    }

    fetch('/program/coorporateall')
        .then(response => response.json())
        .then(data => {
            const coorporateList = document.querySelector('.row.justify-content-center');
            coorporateList.innerHTML = '';

            data.data.forEach(item => {
                const purchased = purchasedPrograms.find(p => p.programId === item.id);
                const isCompleted = purchased && purchased.programStatus === "completed";
                const isPending = purchased && purchased.programStatus === "pending";

                const isDiscount = item.diskon != null;
                const discountedProgram = parseFloat(item.harga) - parseFloat(item.harga) * (item.diskon / 100);
                let programPrice =  `<h4 class="card-title">Rp${parseFloat(parseFloat(item.harga)).toLocaleString('id-ID')}</h4>`;
                if (isDiscount) {
                    programPrice = `<s><h6 class="card-title text-color mb-1" style="font-size: small;">Rp${parseFloat(item.harga).toLocaleString('id-ID')}</h6></s>
                                    <h4 class="card-title">Rp${discountedProgram.toLocaleString('id-ID')}</h4>`;
                }

                let buttonText = "Join now";
                let buttonOnClick = `handleJoinNowCoorporate(${item.id})`;

                if (isCompleted) {
                    buttonText = "My Class";
                    buttonOnClick = `window.location.href='/user/myclass'`;
                } else if (isPending) {
                    buttonText = "to Payment";
                    buttonOnClick = `window.location.href='/payment/checkout?id=${item.id}&method=${purchased.programBank}'`;
                }

                const courseItem = document.createElement('div');
                courseItem.className = 'col-lg-4 col-sm-6 mb-5';

                courseItem.innerHTML = `
                    <div class="card p-0 border-primary rounded-0 hover-shadow">
                        <img class="card-img-top rounded-0 img-course-thumb" src="${item.gambar}" alt="coorporate thumb">
                        <div class="card-body">
                            <ul class="list-inline mb-2">
                                <li class="list-inline-item bg-third padds"><a class="text-primary" href="/program/coorporateall"><strong>${item.type.nama}</strong></a></li>
                                <li class="list-inline-item bg-third padds"><i class="ti-alarm-clock mr-1 text-primary"></i><strong class="text-primary">${item.durasi} Jam/Hari</strong></li>
                            </ul>
                            <a href="/program/coorporate/single?id=${item.id}">
                                <h5 class="card-title">${item.nama_program}</h5>
                            </a>
                            <p class="card-text mb-4" style="text-align: left">${truncateText(item.detail, 7)}</p>
                            <ul class="list-inline">
                                <li class="list-inline-item mb-20-m">
                                    <a onclick="${buttonOnClick}" class="btn btn-primary btn-sm">${buttonText}</a>
                                </li>
                                <li class="list-inline-item">${programPrice}</li>
                            </ul>
                        </div>
                    </div>
                `;

                coorporateList.appendChild(courseItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
}

// GET 3 Coorporates
async function get3Coorporates() {
    let purchasedPrograms = [];

    if (await isUserLoggedIn()) {
        purchasedPrograms = await getUserPurchasedPrograms();
    }

    fetch('/program/coorporate3')
        .then(response => response.json())
        .then(data => {
            const coorporateList = document.querySelector('.coorporate');
            coorporateList.innerHTML = '';

            data.data.forEach(item => {
                const purchased = purchasedPrograms.find(p => p.programId === item.id);
                const isCompleted = purchased && purchased.programStatus === "completed";
                const isPending = purchased && purchased.programStatus === "pending";

                const isDiscount = item.diskon != null;
                const discountedProgram = parseFloat(item.harga) - parseFloat(item.harga) * (item.diskon / 100);
                let programPrice =  `<h4 class="card-title">Rp${parseFloat(parseFloat(item.harga)).toLocaleString('id-ID')}</h4>`;
                if (isDiscount) {
                    programPrice = `<s><h6 class="card-title text-color mb-1" style="font-size: small;">Rp${parseFloat(item.harga).toLocaleString('id-ID')}</h6></s>
                                    <h4 class="card-title">Rp${discountedProgram.toLocaleString('id-ID')}</h4>`;
                }

                let buttonText = "Join now";
                let buttonOnClick = `handleJoinNowCoorporate(${item.id})`;

                if (isCompleted) {
                    buttonText = "My Class";
                    buttonOnClick = `window.location.href='/user/myclass'`;
                } else if (isPending) {
                    buttonText = "to Payment";
                    buttonOnClick = `window.location.href='/payment/checkout?id=${item.id}&method=${purchased.programBank}'`;
                }

                const courseItem = document.createElement('div');
                courseItem.className = 'col-lg-4 col-sm-6 mb-5';

                courseItem.innerHTML = `
                    <div class="card p-0 border-primary rounded-0 hover-shadow">
                        <img class="card-img-top rounded-0 img-course-thumb" src="${item.gambar}" alt="coorporate thumb">
                        <div class="card-body">
                            <ul class="list-inline mb-2">
                                <li class="list-inline-item bg-third padds"><a class="text-primary" href="/program/coorporateall"><strong>${item.type.nama}</strong></a></li>
                                <li class="list-inline-item bg-third padds"><i class="ti-alarm-clock mr-1 text-primary"></i><strong class="text-primary">${item.durasi} Jam/Hari</strong></li>
                            </ul>
                            <a href="/program/coorporate/single?id=${item.id}">
                                <h5 class="card-title">${item.nama_program}</h5>
                            </a>
                            <p class="card-text mb-4" style="text-align: left">${truncateText(item.detail, 7)}</p>
                            <ul class="list-inline">
                                <li class="list-inline-item mb-20-m">
                                    <a onclick="${buttonOnClick}" class="btn btn-primary btn-sm">${buttonText}</a>
                                </li>
                                <li class="list-inline-item">${programPrice}</li>
                            </ul>
                        </div>
                    </div>
                `;

                coorporateList.appendChild(courseItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
}

function pageCoorporateById() {
    fetch('/program/coorporate/single/:id')
}

function pageCoorporatePaymentById() {
    fetch('/coorporate/payment-details/:id')
}

// Fungsi untuk mengambil ID dari URL
function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// GET by ID
async function getCoorporateById() {
    const id = getIdFromUrl();
    console.log('ID dari URL:', id);
    
    if (!id) {
        console.error("ID tidak ditemukan di URL");
        return;
    }

    try {
        // Ambil data program berdasarkan ID
        const response = await fetch(`/program/coorporateid/${id}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        
        const data = await response.json();
        if (!data.success) {
            console.error("Data tidak ditemukan");
            return;
        }

        const program = data.data;

        // Ambil daftar program yang telah dibeli oleh user
        let purchasedPrograms = [];

        if (await isUserLoggedIn()) {
            purchasedPrograms = await getUserPurchasedPrograms();
        }
        const purchased = purchasedPrograms.find(p => p.programId === program.id);
        const isCompleted = purchased && purchased.programStatus === "completed";
        const isPending = purchased && purchased.programStatus === "pending";

        // Isi elemen HTML di coorporate-single.html dengan data yang diterima
        document.getElementById('gambar_program').src = program.gambar;
        document.getElementById('nama_program').innerText = program.nama_program;
        document.getElementById('program_type').innerText = program.type.nama;
        document.getElementById('durasi').innerText = `${program.durasi} Jam/Hari`;
        document.getElementById('detail_program').innerText = program.detail;
        document.getElementById('harga').innerText = `Rp${parseFloat(program.harga).toLocaleString('id-ID')}`;
        document.getElementById('harga_mobile').innerText = `Rp${program.harga.toLocaleString('id-ID')}`;

        // Handle tombol Join Now / My Class
        const joinNowButtons = document.querySelectorAll(".join-now-coorporate");
        joinNowButtons.forEach(button => {
            if (isCompleted) {
                button.innerText = "My Class";
                button.setAttribute("onclick", `window.location.href='/user/myclass'`);
            } else if (isPending) {
                button.innerText = "to Payment";
                button.setAttribute("onclick", `window.location.href='/payment/checkout?id=${program.id}&method=${purchased.programBank}'`);
            } else {
                button.innerText = "Join Now";
                button.setAttribute("onclick", `handleJoinNowCoorporate('${program.id}')`);
            }
        });

        // Load materi, prospek, dan pengajar
        loadMateri(program.materi);
        loadProspek(program.prospek);
        loadPengajar(program.pengajar);

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Fungsi untuk menganbil data by ID (untuk payment)
function getCoorporatePaymentById() {
    const id = getIdFromUrl();
    if (!id) {
        console.error("ID tidak ditemukan di URL");
        return;
    }

    fetch(`/program/coorporateid/${id}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const program = data.data;
                let discount = program.diskon;
                let harga = Number(program.harga); 
                
                if (discount != null) {
                    programDiscount = harga * discount / 100;
                    amount = harga - programDiscount;
                    discountlabel = discount + `%`;
                } else {
                    amount = harga;
                    discountlabel = `-`;
                }

                // Isi elemen HTML di coorporate-single.html dengan data yang diterima
                document.getElementById('nama_program').innerText = program.nama_program;
                document.getElementById('checkout_nama_program').innerText = program.nama_program;
                document.getElementById('program_type').innerText = program.type.nama;
                document.getElementById('durasi').innerText = `${program.durasi} Jam/Hari`;
                document.getElementById('detail_program').innerText = program.detail;
                document.getElementById('harga').innerText = `Rp${harga.toLocaleString('id-ID')}`;
                document.getElementById('diskon').innerText = `${discountlabel}`;
                document.getElementById('amount').innerText = `Rp${amount.toLocaleString('id-ID')}`;

                loadMateri(program.materi);
                loadPengajar(program.pengajar);
            } else {
                console.error("Data tidak ditemukan");
            }
        })
        .catch(error => console.error("Fetch error:", error));
}

// Fungsi untuk memuat materi
function loadMateri(materi) {
    const materiList = document.getElementById('lesson_content');
    materiList.innerHTML = ''; // Kosongkan list

    materi.forEach(item => {
        const li = document.createElement('li');
        li.className = 'text-primary';
        li.textContent = item.nama;
        materiList.appendChild(li);
    });
}

// Fungsi untuk memuat prospek kerja
function loadProspek(prospek) {
    const prospekList = document.getElementById('prospek_content');
    prospekList.innerHTML = ''; // Kosongkan list

    prospek.forEach(item => {
        const li = document.createElement('li');
        li.className = 'text-large';
        li.textContent = item.nama;
        prospekList.appendChild(li);
    });
}

// Fungsi untuk memuat data pengajar
function loadPengajar(pengajar) {
    const pengajarContainer = document.getElementById('teachers_content');
    pengajarContainer.innerHTML = ''; // Kosongkan kontainer

    pengajar.forEach(item => {
        console.log('Pengajar item:', item);
        console.log('Item:', item);
        console.log('Item.jabatan:', item.jabatan);
        const div = document.createElement('div');
        div.className = 'media';
        div.innerHTML = `
            <img src="${item.gambar}" class="mr-4 img-fluid" style="width: 75px; height: 100px; object-fit: cover;" alt="Teacher">
            <div class="media-body">
                <h4 class="mt-0">${item.fullname}</h4>
                <p>${item.jabatan}</p>
            </div>
        `;
        pengajarContainer.appendChild(div);
    });
}

//truncate detail./
function truncateText(text, maxWords) {
    const words = text.split(' ');

    // Periksa apakah panjangnya melebihi jumlah maksimum kata
    if (words.length > maxWords) {
        // Gabungkan kata hingga batas yang ditentukan dan tambahkan '...'
        return words.slice(0, maxWords).join(' ') + '...';
    }
    // Jika tidak, kembalikan teks asli
    return text;
}

