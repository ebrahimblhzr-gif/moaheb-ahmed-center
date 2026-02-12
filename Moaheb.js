document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تهيئة مكتبة AOS للتحريك عند التمرير
    AOS.init({
        duration: 1000,
        easing: 'ease-out-back',
        once: false,
        mirror: true
    });

    // 2. القائمة المتجاوبة للجوال
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
});

    // 3. نظام الفلترة الذكي
    const filterBtns = document.querySelectorAll('.btn-filter');
    const items = document.querySelectorAll('.talent-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // تحديث الأزرار
            document.querySelector('.btn-filter.active').classList.remove('active');
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
            // تحديث AOS بعد الفلترة
            setTimeout(() => AOS.refresh(), 400);
        });
    });

    // 4. تأثير Parallax Light في الهيرو سيكشن
    const hero = document.querySelector('.hero-section');
    const content = document.querySelector('.content-box');

    hero.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        content.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // إعادة المحاذاة عند خروج الماوس
    hero.addEventListener('mouseleave', () => {
        content.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
});

function openExpertPortfolio(name, works) {
    const modal = document.getElementById('portfolioModal');
    document.getElementById('modalName').innerText = name;
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = ''; 

    // منطق احترافي: إذا كانت كل الأعمال صور، نغير شكل العرض ليصبح "ألبوم"
    const isGalleryOnly = works.every(w => w.type === 'image');
    
    works.forEach((work, index) => {
        const item = document.createElement('div');
        item.className = 'dock-item';
        
        // اختيار أيقونة ذكية بناءً على نوع العمل
        let icon = {
            'video': 'fa-play-circle',
            'image': 'fa-camera',
            'audio': 'fa-microphone-alt',
            'text': 'fa-pen-nib'
        }[work.type] || 'fa-star';

        item.innerHTML = `<i class="fas ${icon}"></i>`;
        item.title = work.title; // يظهر اسم العمل عند الوقوف بالماوس
        
        item.onclick = () => {
            renderMedia(work);
            document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };

        playlist.appendChild(item);
        if(index === 0) item.click();
    });

    modal.style.display = 'flex';
}

function renderMedia(work) {
    const container = document.getElementById('mediaContainer');
    const titleDisplay = document.getElementById('currentWorkTitle');
    titleDisplay.innerText = work.title;
    container.innerHTML = ''; // تنظيف المسرح
    
    // التبديل الذكي حسب النوع
    switch(work.type) {
        case 'video':
            container.innerHTML = `
        <div style="width:100%; height:100%; overflow:hidden;">
            <iframe 
                src="${work.url}?autoplay=1&rel=0&showinfo=0&modestbranding=1" 
                allow="autoplay; encrypted-media" 
                allowfullscreen 
                style="width:100%; height:100%; border:none;">
            </iframe>
        </div>
    `;
            break;
        case 'image':
            container.innerHTML = `<img src="${work.url}" class="fade-in img-fluid-preview" onclick="window.open(this.src)">`;
            break;
        case 'audio':
            container.innerHTML = `
                <div class="audio-player-wrapper fade-in">
                    <i class="fas fa-music-alt"></i>
                    <h4>${work.title}</h4>
                    <audio controls><source src="${work.url}" type="audio/mpeg"></audio>
                </div>`;
            break;
        case 'text':
            container.innerHTML = `
                <div class="premium-reader fade-in">
                    <h3>${work.title}</h3>
                    <div class="text-body">${work.content}</div>
                </div>`;
            break;
        case 'instagram':
            container.innerHTML = `
                <div class="instagram-card fade-in">
                    <i class="fab fa-instagram social-icon-big"></i>
                    <h4>تابع المبدع على إنستقرام</h4>
                    <div class="qr-placeholder">
                        <img src="${work.qrUrl}" alt="Instagram QR Code">
                    </div>
                    <a href="${work.url}" target="_blank" class="btn-filter active">زيارة الحساب الشخصي</a>
                </div>`;
            break;
    }
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    const container = document.getElementById('mediaContainer');
    
    // إخفاء النافذة
    modal.style.display = 'none';
    
    // تفريغ المحتوى (لإيقاف الفيديوهات والصوت تماماً)
    if (container) {
        container.innerHTML = '';
    }
    
    // إعادة تمكين السكرول (التمرير) في الصفحة الرئيسية
    document.body.style.overflow = 'auto';
}

// إضافة ميزة الإغلاق عند الضغط خارج النافذة (على المنطقة الشفافة)
window.onclick = function(event) {
    const modal = document.getElementById('portfolioModal');
    if (event.target == modal) {
        closeModal();
    }
}


document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const speed = 20;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        hero.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // 1. وظيفة التبديل الآلي للصور
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // تبديل كل 4 ثوانٍ
    setInterval(nextSlide, 4000);

    // 2. حركة الماوس الاحترافية (Parallax)
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;

        slides.forEach(slide => {
            // تحريك طفيف يعطي شعور الـ 3D
            slide.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
        });
    });
});

function openExpertPortfolio(name, works) {
    document.getElementById('modalName').innerText = name;
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = ''; 

    works.forEach((work, index) => {
        const btn = document.createElement('button');
        btn.className = 'dock-btn';
        const icon = work.type === 'video' ? 'fa-play' : 'fa-image';
        btn.innerHTML = `<i class="fas ${icon}"></i>`;
        
        btn.onclick = () => {
            document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('currentWorkTitle').innerText = work.title;
            renderMedia(work);
        };
        
        playlist.appendChild(btn);
        if(index === 0) btn.click();
    });

    document.getElementById('portfolioModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('portfolioModal').style.display = 'none';
    document.getElementById('mediaContainer').innerHTML = ''; // إيقاف الفيديو عند الإغلاق
}

function openExpertPortfolio(name, works) {
    document.getElementById('modalName').innerText = name;
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = ''; 

    works.forEach((work, index) => {
        const btn = document.createElement('button');
        btn.className = 'dock-btn';
        
        // إذا كان العمل هو انستقرام، نعطيه شكلاً خاصاً
        if (work.type === 'instagram') {
            btn.classList.add('btn-instagram');
            btn.innerHTML = `<i class="fab fa-instagram"></i>`;
        } else {
            const icon = work.type === 'video' ? 'fa-play' : 'fa-image';
            btn.innerHTML = `<i class="fas ${icon}"></i>`;
        }
        
        btn.onclick = () => {
            // إضافة أنيميشن بسيط للمحتوى عند التبديل
            const stage = document.querySelector('.final-video-stage');
            stage.style.opacity = '0';
            
            setTimeout(() => {
                document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('currentWorkTitle').innerText = work.title;
                renderMedia(work);
                stage.style.opacity = '1';
            }, 200);
        };
        
        playlist.appendChild(btn);
        if(index === 0) btn.click();
    });

    document.getElementById('portfolioModal').style.display = 'flex';
}