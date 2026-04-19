document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Kursor Kustom --- */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Deteksi perangkat mobile
    const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    
    if (!isMobile && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Pengikutan kursor yang lebih halus (smooth follow anim)
        const renderFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            requestAnimationFrame(renderFollower);
        };
        renderFollower();

        // Efek hover pada elemen yang bisa diklik
        const clickables = document.querySelectorAll('a, button, .portfolio-card, .service-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
        });
    }

    /* --- 2. Perubahan Gaya Navigasi saat Scroll & Menu Mobile --- */
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });

    // Menyorot navigasi aktif saat scroll (Scroll Spy)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links .nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* --- 3. Animasi Muncul saat Scroll (Scroll Reveal Observer) --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Hanya animasi satu kali
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Stagger / Animasi Berurutan
    const staggerParentOptions = { threshold: 0.1 };
    const gridSections = document.querySelectorAll('.service-grid, .portfolio-gallery');
    
    gridSections.forEach(section => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                const children = section.querySelectorAll('.reveal-stagger');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 150); // Jeda 150ms per elemen
                });
                observer.unobserve(section);
            }
        }, staggerParentOptions);
        observer.observe(section);
    });

    /* --- 4. Sistem Filter Portofolio --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus kelas aktif dari semua tombol
            filterBtns.forEach(b => b.classList.remove('active'));
            // Tambahkan kelas aktif pada tombol yang diklik
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                // Efek mengecil dulu
                item.style.transform = "scale(0.8)";
                item.style.opacity = "0";
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = "block";
                        // Efek membesar pelan-pelan
                        setTimeout(() => {
                            item.style.transform = "scale(1)";
                            item.style.opacity = "1";
                        }, 50);
                    } else {
                        item.style.display = "none";
                    }
                }, 400); // Tunggu sampai animasi mengecil selesai
            });
        });
    });

    /* --- 5. Carousel/Slider Testimoni --- */
    const track = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('dots');
    
    let currentIndex = 0;
    
    // Membuat dot navigasi
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * (100 / slides.length)}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateSlider();
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateSlider();
    });
    
    // Putar otomatis setiap 6 detik
    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateSlider();
    }, 6000);

    // Hentikan putar otomatis saat disentuh/di-klik
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateSlider();
        }, 6000);
    });

    /* --- 6. Efek Ripple pada Tombol --- */
    const buttons = document.querySelectorAll('.hover-ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    /* --- 7. Simulasi Pengiriman Formulir Kontak --- */
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Tampilan saat loading
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Mengirim...';
            
            // Jeda seakan-akan sedang upload data
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
                btn.style.background = '#00ff99'; // Ubah warna jadi hijau sukses
                contactForm.reset(); // Kosongkan form
                
                // Kembalikan tombol seperti semula setelah 3 detik
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // reset ke CSS gradient
                }, 3000);
            }, 1500);
        });
    }
});
