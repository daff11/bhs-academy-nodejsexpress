// Coorporate
async function coorporatePayment () {
    try {
        // Ambil user dari sesi backend
        const userSessionResponse = await fetch('/auth/get-user-session');
        const userSessionData = await userSessionResponse.json();

        if (!userSessionData.success) {
            alert('Anda belum login. Silakan login terlebih dahulu.');
            return;
        }
        const userId = userSessionData.userId;

        // Ambil program ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const programId = urlParams.get('id'); 

        if (!programId) {
            alert('Program ID tidak valid.');
            return;
        }

        // Ambil data program dari backend
        const programResponse = await fetch(`/program/coorporateid/${programId}`);
        const programData = await programResponse.json();

        if (!programData.success) {
            alert('Program tidak ditemukan.');
            return;
        }

        // Tambahkan event listener untuk tombol pembayaran
        const payButton = document.getElementById('pay-button');
        if (payButton) {
            payButton.addEventListener('click', function () {
                window.location.href = `/payment/checkout?id=${programId}`;
              });
        }
    } catch (err) {
        console.error('Kesalahan memuat halaman pembayaran:', err);
        alert('Terjadi kesalahan saat memuat halaman.');
    }
};

async function createPendingTransaction() {
    const programId = new URLSearchParams(window.location.search).get("id");
    if (!programId) return;

    try {
        await fetch(`/payment/create-transactions/${programId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "pending" }) // Bisa custom jika backend support
        });
    } catch (error) {
        console.error("Gagal membuat transaksi pending:", error);
    }
}
 
function togglePaymentOptions(type) {
    document.getElementById("bank-options").classList.add("d-none");
    document.getElementById("ewallet-options").classList.add("d-none");
  
    if (type === 'bank') {
      document.getElementById("bank-options").classList.remove("d-none");
    } else {
      document.getElementById("ewallet-options").classList.remove("d-none");
    }
}

function initPaymentCategorySelector() {
    const dropdown = document.getElementById("payment-method-select");
    dropdown.addEventListener("change", async function () {
        const selected = this.value;
        if (!selected) return;

        // Sembunyikan dropdown
        dropdown.disabled = true;
        dropdown.parentElement.style.display = "none";

        // Lakukan request create-VA ulang dengan bank terpilih
        const programId = new URLSearchParams(window.location.search).get("id");
        const response = await fetch(`/payment/create-transactions/${programId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bank: selected }),
        });

        const data = await response.json();
        if (!data.success) {
            alert("Gagal membuat transaksi, coba lagi.");
            return;
        }

        // Tampilkan info VA
        document.getElementById("payment-info").style.display = "block";
        document.getElementById("bank-name").textContent = selected.toUpperCase();
        document.getElementById("va-number").textContent = data.va_number;
        document.getElementById("amount").textContent = parseInt(data.gross_amount).toLocaleString("id-ID", {
            style: "currency", currency: "IDR", minimumFractionDigits: 0
        });

        const deadline = new Date(data.deadlineDate);
        document.getElementById("payment-deadline").textContent =
            "Pay before: " + deadline.toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }) + ' At 23:59';

        showInstructions(selected);
        setTimeout(pollPaymentStatus, 5000); // Mulai polling
    });
}

function showInstructions(selected) {
    const map = {
        bca: ["1. Buka aplikasi BCA", "2. Pilih Transfer > VA", "3. Masukkan nomor VA", "4. Selesaikan pembayaran"],
        bni: ["1. Login m-Banking BNI", "2. Pilih Virtual Account", "3. Masukkan VA", "4. Lanjutkan pembayaran"],
        bri: ["1. Buka BRImo", "2. Pilih BRIVA", "3. Masukkan nomor VA", "4. Lanjutkan pembayaran"],
        mandiri: ["1. Login Livin'", "2. Pilih Multipayment", "3. Masukkan VA", "4. Bayar"],
        cimb: ["1. Buka CIMB OCTO", "2. Pilih VA", "3. Input VA", "4. Selesaikan"],
        dana: ["1. Buka aplikasi Dana", "2. Pilih Kirim > Rekening", "3. Masukkan nomor VA", "4. Bayar"],
        ovo: ["1. Buka OVO", "2. Pilih Transfer", "3. Masukkan nomor VA", "4. Konfirmasi pembayaran"],
        spaylater: ["1. Buka Shopee", "2. Pilih SPayLater", "3. Masukkan VA", "4. Bayar"]
    };

    const steps = map[selected] || ["Ikuti instruksi sesuai metode pembayaran Anda"];
    const list = document.getElementById("instructions-list");
    list.innerHTML = "";
    steps.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        list.appendChild(li);
    });
}

// Payment Methods
function copyVA() {
    const va = document.getElementById("va-number").textContent;
    navigator.clipboard.writeText(va);
    alert("Nomor VA berhasil disalin!");
}
 
let isPollingStarted = false;
// Payment Methods

//Check purchase status
async function pollPaymentStatus() {
    try {
        const programId = new URLSearchParams(window.location.search).get("id");

        const response = await fetch('/payment/getprogramuserid');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const match = data.data.find(p => p.programId == programId);

            if (match && match.programStatus.toLowerCase() === "completed") {
                window.location.href = `/payment/success?id=${programId}`;
                return;
            }
        }

        setTimeout(pollPaymentStatus, 5000); // polling ulang
    } catch (error) {
        console.error('Gagal polling status pembayaran:', error);
        setTimeout(pollPaymentStatus, 5000);
    }
}

//Success
async function paymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get("id");
  
    if (!programId) return;
  
    try {
      const response = await fetch(`/program/coorporateid/${programId}`);
      const data = await response.json();
  
      if (data.success) { 
        document.getElementById("program-name").textContent = data.data.nama_program || "-";
        document.getElementById("program-price").textContent = parseInt(data.data.harga).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR"
        });
  
        const now = new Date();
        document.getElementById("purchase-date").textContent = now.toLocaleDateString("id-ID", {
          day: "numeric", month: "long", year: "numeric"
        });
  
        document.getElementById("purchase-detail").style.display = "block";
      }
    } catch (err) {
      console.error("Gagal memuat data program:", err);
    }
}

//History
async function paymentHistory(status) {
    try {
        const response = await fetch('/payment/getprogramuserid');
        const result = await response.json();

        if (!result.success) return;

        let data = result.data;

        // Filter status
        if (status !== "all") {
            data = data.filter(p => p.programStatus.toLowerCase() === status.toLowerCase());
        }

        data = data.filter(p => p.programStatus.toLowerCase() !== "cancelled"); 

        const historyContainer = document.querySelector(".paymentHistory");
        historyContainer.innerHTML = "";

        // Urutkan terbaru
        data.sort((a, b) => new Date(b.programPurchaseDate) - new Date(a.programPurchaseDate));

        data.forEach(p => {
            // const purchaseDate = p.purchaseDate;
            const deadline = new Date(p.programDeadlineDate);
            const formattedDeadline = deadline.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }) + ' At 23:59';

            const isPending = p.programStatus === "pending";
            const rightContent = isPending
                ? `
                    <div class="text-right text-muted" style="font-size: 1.2rem;">
                        <div class="d-flex flex-column justify-content-center h-100 text-center" style="min-height: 170px; margin-right: 30px;">
                            <div><strong class="text-dark">Pay before:</strong></div>
                            <div class="text-primary"><strong>${formattedDeadline}</strong></div>
                        </div>
                    </div>
                `
                : `
                    <div class="text-success d-flex flex-column justify-content-center text-center" style="min-height: 170px; margin-right: 30px;">
                        <i class="fa fa-check-circle fa-2x mb-2"></i>
                        <strong>Completed</strong>
                    </div>
                `;

            const card = document.createElement("div");
            card.className = "col-12 mb-4";
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-center bg-white p-2 rounded-0 hover-shadow border-primary">
                    <div class="d-flex">
                        <img src="${p.programPurchaseGambar}" alt="Program Image" class="rounded" style="width: auto; height: 150px; object-fit: cover;">
                        <div class="ml-3">
                            <h5 class="mb-1">${p.programPurchaseName}</h5>
                            <h5 class="text-primary mb-2">Rp ${parseInt(p.programPurchaseHarga).toLocaleString("id-ID")}</h5>
                            <span class="badge badge-lg ${isPending ? "bg-warning" : "bg-success"} mb-2 text-white">${p.programStatus}</span><br>
                            ${isPending && p.programBank ? `<a href="/payment/checkout?id=${p.programId}&method=${p.programBank}" class="btn btn-sm btn-primary mt-2">To Payment</a>` 
                            : 
                            `<a class="text-secondary" href="/payment/success?id=${p.programId}" <h5 class="card-title">See Details</h5></a>`}
                        </div>
                    </div>
                    ${rightContent}
                </div>
            `;

            historyContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Gagal memuat histori pembayaran:", error);
        document.querySelector(".paymentHistory").innerHTML = "<p class='mt-2'>Terjadi kesalahan saat memuat histori pembayaran.</p>";
    }
}
