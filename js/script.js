document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or use system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    const toggleTheme = () => {
        htmlElement.classList.toggle('dark');
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleMobileBtn.addEventListener('click', toggleTheme);


    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close mobile menu on link click
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-primary-600', 'dark:text-primary-400', 'font-semibold');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('text-primary-600', 'dark:text-primary-400', 'font-semibold');
            }
        });
    });

    // --- Navbar Blur/Style on Scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    });

    // --- Intersection Observer for Scroll Animations (slide-up) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'show' class to trigger animation
                entry.target.classList.add('show');

                // If the element contains skill bars, animate them
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }

                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.slide-up');
    animatedElements.forEach(el => observer.observe(el));

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('bg-primary-600', 'text-white');
                b.classList.add('bg-white', 'text-gray-700', 'dark:bg-dark-card', 'dark:text-gray-300');
            });
            // Add active class to clicked button
            btn.classList.remove('bg-white', 'text-gray-700', 'dark:bg-dark-card', 'dark:text-gray-300');
            btn.classList.add('bg-primary-600', 'text-white');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Re-trigger animation for nicely fading in
                    card.classList.remove('show');
                    setTimeout(() => card.classList.add('show'), 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Typing Effect for Hero Section ---
    const typingRoles = [
        "AI/ML Engineer",
        "Python Developer"
    ];
    const roleElement = document.getElementById('typing-role');

    if (roleElement) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = typingRoles[textIndex];

            if (isDeleting) {
                roleElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                roleElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at the end of the line
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingRoles.length;
                typeSpeed = 500; // Pause before typing the next string
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing effect on load
        setTimeout(() => {
            roleElement.textContent = '';
            type();
        }, 500);
    }

    // --- Contact Form Handling & Validation ---
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                formResult.textContent = "Please fill out all fields.";
                formResult.className = "mt-4 text-center font-medium text-red-500 block";
                return;
            }
            
            // Simple email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formResult.textContent = "Please enter a valid email address.";
                formResult.className = "mt-4 text-center font-medium text-red-500 block";
                return;
            }

            formResult.textContent = "Sending...";
            formResult.className = "mt-4 text-center font-medium text-gray-600 dark:text-gray-400 block";

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    formResult.textContent = "Message sent successfully!";
                    formResult.className = "mt-4 text-center font-medium text-green-600 dark:text-green-400 block";
                    contactForm.reset();
                } else {
                    console.log(response);
                    formResult.textContent = jsonResponse.message || "Something went wrong!";
                    formResult.className = "mt-4 text-center font-medium text-red-500 block";
                }
            })
            .catch(error => {
                console.log(error);
                formResult.textContent = "Something went wrong!";
                formResult.className = "mt-4 text-center font-medium text-red-500 block";
            })
            .then(function() {
                setTimeout(() => {
                    formResult.className = "hidden";
                }, 5000);
            });
        });
    }
});
