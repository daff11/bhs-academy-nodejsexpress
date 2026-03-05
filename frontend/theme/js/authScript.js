/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

let failedLoginAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '{}');

// Mengatur visibilitas elemen berdasarkan status login
function updateLoginStatus(isLoggedIn, name, profileImage) {
    const loginLink = document.getElementById('login');
    const signupLink = document.getElementById('register');
    const teacherLink = document.getElementById('jointeacher');
    const myclassLink = document.getElementById('myclass');
    const logoutLink = document.getElementById('logout');
    const userGreeting = document.getElementById('userGreeting');
    const profileImg = document.querySelector('#profileDropdownContainer img');
    const profileDropdownContainer = document.getElementById('profileDropdownContainer');

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        teacherLink.style.display = 'none';
        myclassLink.style.display = 'inline-block';
        logoutLink.style.display = 'inline-block';

        // Tampilkan fullname dan profileImage
        userGreeting.innerText = name;
        userGreeting.style.display = 'inline-block';
        profileImg.src = profileImage || '/uploads/user/profile-user.png';
        profileDropdownContainer.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
        teacherLink.style.display = 'inline-block';
        myclassLink.style.display = 'none';
        logoutLink.style.display = 'none';
        userGreeting.style.display = 'none';
        profileDropdownContainer.style.display = 'none';
    }
}

async function loginAdmin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("/auth/login-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
  
      const data = await res.json();
  
      if (res.ok && data.success) {
        // Simpan nama dan foto profil admin
        localStorage.setItem('adminName', 'Admin');
        localStorage.setItem('adminImage', data.user.profileImage);
  
        window.location.href = "/admin/dashboard";
      } else {
        alert(data.message || "Login gagal. Email atau password salah.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan saat login.");
    }
}
  
// REGISTER USER (PELAJAR)
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmpassword: formData.get('confirmpassword')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registrasi berhasil!');
            $('#signupModal').modal('hide');
            window.location.href = '/';
        } else {
            alert(data.message || 'Registrasi gagal.');
        }
    })
    .catch(error => console.error('Error:', error));
});

// REGISTER TEACHER
document.getElementById('teacherRegister').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    fetch('/auth/register-teacher', {
        method: 'POST',
        body: JSON.stringify({
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmpassword: formData.get('confirmpassword')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registrasi berhasil!');
            $('#teacherModal').modal('hide');
            window.location.href = '/';
        } else {
            alert(data.message || 'Registrasi gagal.');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Fungsi untuk VERIFY CAPTCHA
function verifyCaptcha() {
    const captchaToken = grecaptcha.getResponse();
    if (!captchaToken) {
        alert("Captcha tidak terverifikasi!");
        return false;
    }
    return captchaToken; // Token valid
}

// Callback untuk CAPTCHA
function onCaptchaSuccess(captchaToken) {
    console.log('Captcha berhasil, Token:', captchaToken);

    const activeModal = document.querySelector('.modal.show');
    if (activeModal) {
        const captchaInput = activeModal.querySelector('input[name="captchaToken"]');
        if (captchaInput) captchaInput.value = captchaToken;
    }
}

// LOGIN USER (PELAJAR)
function loginUser(captchaToken = null) {
    const formData = new FormData(document.getElementById('loginForm'));
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        captchaToken: captchaToken // Sertakan token CAPTCHA
    };

    fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Login data:', data);
            if (data.success) {
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('profileImage', data.user.profileImage);
                localStorage.setItem('failedLoginAttempts', 0);
                updateLoginStatus(true, data.user.name, data.user.profileImage);
                $('#loginModal').modal('hide');
                location.reload();
            } else {
                alert(data.message); // Tampilkan pesan error
                failedLoginAttempts++;
                localStorage.setItem('failedLoginAttempts', failedLoginAttempts);

                // Reset dan eksekusi CAPTCHA jika gagal 3 kali
                if (failedLoginAttempts >= 3) {
                    grecaptcha.reset();
                    grecaptcha.execute();
                }
            }
        })
        .catch(error => console.error('Login error:', error));
}

// Tangani submit form login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const captchaToken = document.getElementById('captchaToken').value;

    if (!captchaToken && failedLoginAttempts >= 3) {
        alert("Harap selesaikan CAPTCHA terlebih dahulu.");
        return;
    }

    loginUser(captchaToken); // Kirim token saat login
});


// Pastikan CAPTCHA ter-render dengan benar saat modal login muncul
document.getElementById('loginModal').addEventListener('shown.bs.modal', function () {
    const captchaContainer = document.querySelector('#captcha-container');
    if (!captchaContainer.querySelector('.g-recaptcha')) {
        const siteKey = 'CAPTCHA_SITE_KEY'; // Pastikan ini sudah diganti dengan site key sebenarnya
        grecaptcha.render(captchaContainer, {
            sitekey: siteKey,
            callback: onCaptchaSuccess // Panggil fungsi callback saat berhasil
        });
    }
    captchaContainer.style.display = 'block';
});

// Sembunyikan CAPTCHA saat modal login ditutup
document.getElementById('loginModal').addEventListener('hidden.bs.modal', function () {
    const captchaContainer = document.querySelector('#captcha-container');
    if (captchaContainer) {
        grecaptcha.reset();
        captchaContainer.style.display = 'none';
    }
});

// LOGIN TEACHER
function loginTeacher(captchaToken = null) {
    const formData = new FormData(document.getElementById('teacherLogin'));
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        captchaToken: captchaToken // Sertakan token CAPTCHA
    };

    fetch('/auth/login-teacher', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Login data:', data);
            if (data.success) {
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('profileImage', data.user.profileImage);
                localStorage.setItem('failedLoginAttempts', 0);
                updateLoginStatus(true, data.user.name, data.user.profileImage);
                $('#teacherModal').modal('hide');
                window.location.href = '/teacher/myclass';
            } else {
                alert(data.message); // Tampilkan pesan error
                failedLoginAttempts++;
                localStorage.setItem('failedLoginAttempts', failedLoginAttempts);

                // Reset dan eksekusi CAPTCHA jika gagal 3 kali
                if (failedLoginAttempts >= 3) {
                    grecaptcha.reset();
                    grecaptcha.execute();
                }
            }
        })
        .catch(error => console.error('Login error:', error));
}

// Tangani submit form login
document.getElementById('teacherLogin').addEventListener('submit', function (event) {
    event.preventDefault();
    const captchaToken = document.querySelector('#teacherModal #captchaToken').value;

    if (!captchaToken && failedLoginAttempts >= 3) {
        alert("Harap selesaikan CAPTCHA terlebih dahulu.");
        return;
    }

    loginTeacher(captchaToken); // Kirim token saat login
});

// Pastikan CAPTCHA ter-render dengan benar saat modal login muncul
document.getElementById('teacherModal').addEventListener('shown.bs.modal', function () {
    const captchaContainer = document.querySelector('#teacher-captcha-container');
    if (!captchaContainer.querySelector('.g-recaptcha')) {
        const siteKey = 'CAPTCHA_SITE_KEY'; // Pastikan ini sudah diganti dengan site key sebenarnya
        grecaptcha.render(captchaContainer, {
            sitekey: siteKey,
            callback: onCaptchaSuccess // Panggil fungsi callback saat berhasil
        });
    }
    captchaContainer.style.display = 'block';
});

// Sembunyikan CAPTCHA saat modal login ditutup
document.getElementById('teacherModal').addEventListener('hidden.bs.modal', function () {
    const captchaContainer = document.querySelector('#teacher-captcha-container');
    if (captchaContainer) {
        grecaptcha.reset();
        captchaContainer.style.display = 'none';
    }
});

// LOGOUT
document.querySelector('#logoutnav').addEventListener('click', function(event) {
    event.preventDefault();

    fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            // Hapus data di localStorage
            localStorage.removeItem('name');
            localStorage.removeItem('profileImage');
            localStorage.removeItem('failedLoginAttempts');
            grecaptcha.reset();
            // Reload halaman setelah logout berhasil
            window.location.href = '/';
        } else {
            // Tampilkan pesan error jika logout gagal
            alert('Error logging out. Please try again.');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    });
});

// Cek status login saat halaman dimuat
fetch('/auth/check-status', {
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Perbarui status login dari server
            updateLoginStatus(true, data.user.name);
            localStorage.setItem('name', data.user.name); // Sinkronkan localStorage
        } else {
            // Hapus status login di localStorage jika server menyatakan logout
            localStorage.removeItem('name');
            localStorage.removeItem('profileImage');
            localStorage.removeItem('lastActivity');
            updateLoginStatus(false);
        }
    })
    .catch(error => console.error('Error checking login status:', error));

fetch('/auth/captcha-site-key')
    .then(response => response.json())
    .then(data => {
        document.querySelectorAll('.g-recaptcha').forEach(el => {
            el.setAttribute('data-sitekey', data.siteKey);
        });
    })

