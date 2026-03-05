/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

async function getAllMyClass() {
    try {
        const response = await fetch('/payment/getprogramuserid');
        const result = await response.json();
        const container = document.querySelector('.myclass');

        // **Filter hanya program dengan status "completed"**
        const completedPrograms = result.data.filter(program => {
            return program.programStatus?.toLowerCase() === "completed";
        });

        if (completedPrograms.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">You don't have any Programs</p>
                    <a href="/"><p>Explore our programs</p></a>
                </div>
            `;
            return; 
        }

        container.innerHTML = '';

        // Loop melalui setiap program yang sudah completed dan ambil progress berdasarkan chapter
        for (const program of completedPrograms) {
            let progress = 0;
            
            try {
                const chapterResponse = await fetch(`/user/myclass/chapter/${program.programId}`);
                const chapterResult = await chapterResponse.json();
                
                if (chapterResult.success && chapterResult.data.length > 0) {
                    const totalChapters = chapterResult.data.length;
                    const completedChapters = chapterResult.data.filter(ch => ch.progress.some(p => p.is_completed)).length;
                    progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
                }
            } catch (err) {
                console.error("Error fetching chapters for program:", program.programId, err);
            }

            let progressClass = 'bg-danger';
            let progressText = 'text-primary';
            if (progress > 40 && progress <= 80) {
                progressClass = 'bg-warning';
                progressText = 'text-warning';
            } else if (progress > 80) {
                progressClass = 'bg-success';
                progressText = 'text-success';
            }

            const card = document.createElement('div');
            card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');

            card.innerHTML = `
                <div class="card border-primary rounded-0 hover-shadow">
                    <div style="position: relative;">
                        <img class="card-img-top img-course-thumb-mini" src="${program.programPurchaseGambar}" alt="${program.programPurchaseName}">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 8px 12px; background: rgba(0, 0, 0, 0.5); color: white;">
                            <span class="card-bottom">
                                <a class="text-white" href="/program/coorporate"><strong>${program.programPurchaseType}</strong></a>
                            </span>
                        </div>
                    </div>
                    <div class="mt-1 pad-10"> 
                        <a href="/user/myclass/${program.programId}">
                            <h5 class="card-title" style="font-size: 16px;">${program.programPurchaseName}</h5>
                        </a>
                        <i class="fa fa-bookmark"></i><span style="font-size: 15px"> ${program.chapters || 4} Chapters</span>
                        
                        <div class="progress mt-2" style="height: 10px;">
                            <div class="progress-bar ${progressClass}" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small class="${progressText}">${Math.round(progress)}% Completed</small>
                    </div>
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading My Class data:', error);
        document.querySelector('.myclass').innerHTML = `
            <div class="mt-4 col-12 text-center">
                <p class="text-danger">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>
            </div>
        `;
    }
}

function convertYoutubeToEmbed(url) {
    try {
        const shortMatch = url.match(/youtu\.be\/([^\?&]+)/);
        const longMatch = url.match(/youtube\.com\/watch\?v=([^\?&]+)/);
        const videoId = shortMatch ? shortMatch[1] : longMatch ? longMatch[1] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch (e) {
        console.error('Error converting YouTube URL:', e);
        return '';
    }
}

async function getByProgramIdMyClass() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const programPurchaseId = urlParams.get('programPurchaseId') || window.location.pathname.split('/').pop(); 

        if (!programPurchaseId) {
            console.error('Program ID tidak ditemukan dalam URL');
            return;
        }

        // Fetch data chapters berdasarkan programPurchaseId
        console.log('Fetching chapters with programPurchaseId:', programPurchaseId);
        const response = await fetch(`/user/myclass/chapter/${programPurchaseId}`);
        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            document.querySelector('.myclassdetails').innerHTML = `
                <div class="col-12 text-center content">
                    <p class="text-muted">No Chapter yet.</p>
                </div>
            `;
            return;
        }

        const chapters = result.data;
        const totalChapters = chapters.length;
        let completedChapters = chapters.filter(chapter => chapter.progress.some(p => p.is_completed)).length;

        function calculateProgress() {
            return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
        }

        function getProgressClass(progress) {
            if (progress > 80) return 'bg-success';
            if (progress > 40) return 'bg-warning';
            return 'bg-danger';
        }

        let progress = calculateProgress();
        let progressClass = getProgressClass(progress);

        const container = document.querySelector('.myclassdetails');
        container.innerHTML = `
            <div class="content">
                <h2 class="mb-4">${chapters[0].program}</h2>

                <div class="row">
                    <div class="col-md-3">
                        <div class="card p-3">
                            <h5 class="mb-3">Chapters</h5>
                            <div class="chapter-progress">
                                <div class="chapter-list">
                                    ${chapters.map((chapter, index) => `
                                        <button class="chapter-btn ${index === 0 ? 'active' : ''}" 
                                            onclick="loadChapter(${index})"
                                            ${index !== 0 && !chapters[index - 1].progress.some(p => p.is_completed) ? 'disabled' : ''}>
                                            ${index + 1}. ${chapter.title}
                                        </button>
                                    `).join('')}
                                </div>

                                <div class="progress-container mt-3">
                                    <div class="progress">
                                        <div class="progress-bar ${progressClass}" id="overallProgress" style="width: ${progress}%"></div>
                                    </div>
                                    <small id="progressText" class="text-primary">${Math.round(progress)}% Completed</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-9">
                        <div class="card p-4">
                            <h5 class="mb-3" id="chapterTitle">${chapters[0].title}</h5>
                            <div class="ratio ratio-16x9 mb-3">
                                <iframe 
                                    id="youtubeEmbed" 
                                    src="${convertYoutubeToEmbed(chapters[0].video_path)}" 
                                    title="Chapter Video" 
                                    frameborder="0" 
                                    width="90%" 
                                    height="400" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                            <p id="chapterContent">${chapters[0].content}</p>

                            <button id="markCompleteBtn" class="btn btn-sm btn-success mt-3" data-chapter-index="0">Mark as Complete</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            const markCompleteBtn = document.getElementById("markCompleteBtn");
            if (markCompleteBtn) {
                markCompleteBtn.disabled = chapters[0].progress.some(p => p.is_completed);
            }
        }, 100);

        // Menonaktifkan Semua Chapter di Awal Kecuali Chapter Pertama
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(".chapter-btn").forEach((btn, index) => {
                btn.disabled = index !== 0 && !chapters[index - 1].progress.some(p => p.is_completed);
            });
        });
        

        // Fungsi untuk memuat chapter baru
        window.loadChapter = function(chapterIndex) {
            const chapter = chapters[chapterIndex];

            document.getElementById("chapterTitle").innerText = chapter.title;
            document.getElementById("youtubeEmbed").src = convertYoutubeToEmbed(chapter.video_path);
            document.getElementById("chapterContent").innerText = chapter.content;

            document.getElementById("markCompleteBtn").dataset.chapterIndex = chapterIndex;
            document.getElementById("markCompleteBtn").disabled = chapter.progress.some(p => p.is_completed);

            document.querySelectorAll(".chapter-btn").forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".chapter-btn")[chapterIndex].classList.add("active");
        };

        // Fungsi untuk menandai chapter sebagai selesai
        document.querySelector('.myclassdetails').addEventListener("click", async function (event) {
            if (event.target && event.target.id === "markCompleteBtn") {
                const chapterIndex = parseInt(event.target.dataset.chapterIndex);
                const chapter = chapters[chapterIndex];
        
                if (!chapter) {
                    console.error("Chapter tidak ditemukan!");
                    return;
                }
        
                try {
                    const response = await fetch('/user/myclass/mark-complete', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ chapterId: chapter.id }),
                    });
        
                    const result = await response.json();
                    if (result.success) {
                        chapters[chapterIndex].progress.push({ is_completed: true });
                        completedChapters++;
                        updateProgress();
        
                        // Reload halaman myclass-details setelah marking selesai
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                    } else {
                        console.error("Gagal menandai sebagai selesai:", result.message);
                    }
                } catch (error) {
                    console.error("Terjadi kesalahan:", error);
                }
            }
        });

        function updateProgress() {
            let progress = calculateProgress();
            let progressBar = document.getElementById("overallProgress");
            let progressText = document.getElementById("progressText");
        
            progressBar.style.width = progress + "%";
            progressBar.className = `progress-bar ${getProgressClass(progress)}`;
            progressText.innerText = Math.round(progress) + "% Completed";
        
            // Enable chapter berikutnya jika sebelumnya sudah selesai
            document.querySelectorAll(".chapter-btn").forEach((btn, index) => {
                if (index !== 0 && chapters[index - 1].progress.some(p => p.is_completed)) {
                    btn.disabled = false;
                }
            });

            // Jika progress 100%, buat sertifikat
            if (progress === 100) {
                createCertificate();
            }
        }        

        updateProgress();

        async function createCertificate() {
            try {
                const response = await fetch('/certificates/create', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ programId: programPurchaseId })
                });
        
                const result = await response.json();
                if (result.success) {
                    console.log("Sertifikat berhasil dibuat!");
                    alert("Selamat! Sertifikat Anda telah dibuat.");
                } else {
                    console.error("Gagal membuat sertifikat:", result.message);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat membuat sertifikat:", error);
            }
        };
    } catch (error) {
        console.error('Error loading chapters:', error);
        document.querySelector('.myclassdetails').innerHTML = `
            <div class="mt-4 col-12 text-center">
                <p class="text-danger">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>
            </div>
        `;
    }
};
