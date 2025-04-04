// /* welcome.js */
// document.getElementById('theme-toggle').addEventListener('click', function () {
//     document.body.classList.toggle('dark-theme');
// });

document.querySelector('.bb8-toggle__checkbox').addEventListener('change', function () {
    document.body.classList.toggle('dark-theme');
});


/* Profile Picture Upload */
document.getElementById('profile-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector('.profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

/* Auto Scrolling Text Slider */
const slides = document.querySelectorAll('.hero-slide');
let currentIndex = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function autoScroll() {
    currentIndex++;
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    }
    showSlide(currentIndex);
}

setInterval(autoScroll, 3000); // Scroll every 3 seconds

/* Dark theme styles */
const style = document.createElement('style');
style.innerHTML = `
    .dark-theme {
        background-color: #1c1c1c;
        color: white;
    }
    .dark-theme .navbar {
        background-color: #333;
    }
    .dark-theme .info-box {
        background: #444;
        color: white;
    }
    .dark-theme .hero {
        background: #222;
    }
    .dark-theme .cta-button {
        background: #ddd;
        color: black;
    }
`;
document.head.appendChild(style);
