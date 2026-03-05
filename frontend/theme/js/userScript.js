/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Ambil data user dari backend
        const response = await fetch('/user/gets', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        if (result.success) {
            const userData = result.data;

            // Update tampilan profil dengan data user
            document.getElementById('username').textContent = userData.fullname;
            document.getElementById('email_user').textContent = userData.email;
            document.getElementById('phone_user').textContent = userData.phone;

            // Jika Anda memiliki gambar profil, tambahkan URL-nya di sini
            const profileImg = document.querySelector('#profile_image img');
            profileImg.src = userData.profile_picture || 'default-profile.jpg'; // Default foto jika tidak ada
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
