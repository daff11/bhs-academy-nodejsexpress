/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

async function getNotifications() {
    try {
      const userSessionResponse = await fetch('/auth/get-user-session');
      const userSessionData = await userSessionResponse.json();
  
      if (!userSessionData.success) {
        alert('Anda belum login. Silakan login terlebih dahulu.');
        return;
      }
  
      const res = await fetch('/notif/getall');
      const data = await res.json();
  
      const container = document.getElementById('notification-list');
      const badge = document.getElementById('notificationBadge');
  
      container.innerHTML = "";
  
      if (!data.success || !data.data.length) {
        container.innerHTML = `<div class="notification-item">There are no notifications</div>`;
        badge.style.display = "none"; 
        return;
      }

      badge.innerText = data.data.length;
      badge.style.display = "inline-block";
  
      data.data.forEach(notif => {        
        const formattedUrl = notif.url;

        const item = document.createElement("a");
        item.href = formattedUrl;
        item.className = `notification-item alert alert-${notif.type} ${!notif.is_read ? 'unread' : ''}`;   
      
        const createdAt = new Date(notif.createdAt);
        const formattedDate = createdAt.toLocaleDateString("id-ID", {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const formattedTime = createdAt.toLocaleTimeString("id-ID", {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      
        item.addEventListener("click", async (e) => {
            e.preventDefault();
            console.log("Notif diklik:", notif.id);
          
            try {
              const response = await fetch(`/notif/mark-as-read/${notif.id}`, { method: "PATCH" });
          
              if (response.ok) {
                console.log("Mark as read berhasil");
                item.classList.remove("unread");
                await updateNotificationBadge();
                window.location.href = formattedUrl;
              } else {
                console.error("Gagal tandai sebagai dibaca");
              }
            } catch (err) {
              console.error("Error saat mark as read:", err);
            }
          });
                   
      
        item.innerHTML = `
          <div class="notif-text">
            <div class="notif-title">${notif.title}</div>
            <p class="text-left">${notif.message}</p>
            <div class="notif-time">${formattedDate} (${formattedTime.replace(':', '.')})</div>
          </div>
        `;
      
        container.appendChild(item);
      });
      
            
  
    } catch (error) {
      console.error("Gagal fetch notifikasi:", error);
    }
}

async function updateNotificationBadge() {
    try {
      const sessionRes = await fetch('/auth/get-user-session');
      const sessionData = await sessionRes.json();
      if (!sessionData.success) return;

      const res = await fetch('/notif/count');
      const data = await res.json();

      const badge = document.getElementById('notificationBadge');

      if (data.success && data.count > 0) {
        badge.innerText = data.count;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    } catch (err) {
      console.error("Gagal ambil jumlah notifikasi:", err);
    }
}
  