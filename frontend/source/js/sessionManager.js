let lastActivityTime = Date.now();

// Fungsi untuk memperbarui waktu aktivitas terakhir
function updateLastActivity() {
    if (isUserLoggedIn()) {
        lastActivityTime = Date.now();
        localStorage.setItem('lastActivity', lastActivityTime);
    }
}

// Memeriksa apakah sesi kedaluwarsa
function checkSessionTimeout() {
    if (!isUserLoggedIn()) {
        console.log("User not logged in locally. Skipping session timeout check.");
        return; // Jika tidak login, hentikan pemeriksaan session timeout
    }
    
    fetch('/auth/check-status', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                console.warn('Session expired or user logged out on server.');

                // Hapus status login di localStorage
                localStorage.removeItem('name');
                localStorage.removeItem('profileImage');
                localStorage.removeItem('lastActivity');

                updateLoginStatus(false);

                alert("Session expired. Please log in again.");
                location.reload();
            } else {
                // Perbarui waktu aktivitas terakhir
                localStorage.setItem('lastActivity', Date.now());
            }
        })
        .catch(error => console.error('Error checking session timeout:', error));
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function isUserLoggedIn() {
    return localStorage.getItem('name') && localStorage.getItem('profileImage');
}

// Event listener untuk memperbarui aktivitas saat pengguna melakukan aksi
document.addEventListener("mousemove", updateLastActivity);
document.addEventListener("keypress", updateLastActivity);
document.addEventListener("scroll", updateLastActivity);

// Interval untuk memeriksa timeout setiap menit (60000 ms)
setInterval(checkSessionTimeout, 60000);

// Saat halaman dimuat, cek status login dari localStorage
document.addEventListener("DOMContentLoaded", () => {
    const storedUsername = localStorage.getItem('name');
    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedUsername && storedProfileImage) {
        updateLoginStatus(true, storedUsername, storedProfileImage);
    } else {
        updateLoginStatus(false);
    }
});
