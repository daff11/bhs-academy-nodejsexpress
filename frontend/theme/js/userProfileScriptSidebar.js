/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/user/gets', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        if (result.success) {
            const userData = result.data;

            // Ambil semua elemen dengan class 'profile_image' dan set src
            const profileImgs = document.querySelectorAll('.profile_image');
            profileImgs.forEach(img => {
                img.src = userData.profile_picture || 'default-profile.jpg';
            });

            // (Opsional) Tampilkan nama dan email juga
            document.getElementById('username').textContent = userData.fullname || '';
            document.getElementById('email_user').textContent = userData.email || '';
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
