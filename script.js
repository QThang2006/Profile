// Mobile Menu Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// Scroll Sections & Active Link Highlight
let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offSet = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offSet && top < offSet + height) {
            navlinks.forEach(link => {
                link.classList.remove('active');
            });
            let activeLink = document.querySelector('header nav a[href*=' + id + ']');
            if (activeLink) {
                activeLink.classList.add('active');
            }
            sec.classList.add('show-animate');
        } else {
            sec.classList.remove('show-animate');
        }
    });

    // Sticky Header
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Close Mobile Menu on Scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
}

// Dynamic Typing Effect
const roles = ["Backend Developer", "Fullstack Developer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenRoles = 2000;

function typeEffect() {
    const typingTextElement = document.querySelector('.typing-text');
    if (!typingTextElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, delayBetweenRoles);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }
}

// Start typing and 3D features when page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
    init3DHeroBackground();
    init3DAvatarTilt();
    init3DCardsTilt();
});

/* =========================================================
   3D THREE.JS PARTICLES & GEOMETRY BACKGROUND (HIGH SENSITIVITY)
   ========================================================= */
function init3DHeroBackground() {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const heroSection = document.querySelector('#home');
    let width = heroSection.clientWidth;
    let height = heroSection.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Create 3D Particle Cloud
    const particleCount = 850;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x3b82f6); // Royal Blue
    const color2 = new THREE.Color(0x60a5fa); // Sky Blue
    const color3 = new THREE.Color(0x38bdf8); // Cyan Accent

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 950;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 700;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

        const randColor = Math.random();
        let mixedColor = color1;
        if (randColor > 0.6) mixedColor = color2;
        else if (randColor > 0.3) mixedColor = color3;

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glowing particle texture
    function createParticleTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 32;
        pCanvas.height = 32;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(96, 165, 250, 0.9)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
        return new THREE.CanvasTexture(pCanvas);
    }

    const particleMaterial = new THREE.PointsMaterial({
        size: 5.5,
        vertexColors: true,
        map: createParticleTexture(),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 2. Floating Wireframe 3D Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(80, 24, 130, 16);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(230, -10, -70);
    scene.add(torusKnot);

    // Balanced Mouse tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        // Smoothly normalized mouse coordinates (-220 to +220 range)
        targetMouseX = ((e.clientX / window.innerWidth) - 0.5) * 220;
        targetMouseY = ((e.clientY / window.innerHeight) - 0.5) * 220;
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth interpolation lerp (0.06 for elegant motion)
        mouseX += (targetMouseX - mouseX) * 0.06;
        mouseY += (targetMouseY - mouseY) * 0.06;

        // Dynamic 3D rotation reacting smoothly to mouse move
        particleSystem.rotation.y = elapsedTime * 0.04 + (mouseX * 0.0015);
        particleSystem.rotation.x = elapsedTime * 0.02 - (mouseY * 0.0015);

        torusKnot.rotation.x = elapsedTime * 0.25 + (mouseY * 0.002);
        torusKnot.rotation.y = elapsedTime * 0.3 + (mouseX * 0.002);

        // Elegant camera parallax depth shift
        camera.position.x = mouseX * 0.45;
        camera.position.y = -mouseY * 0.45;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

/* =========================================================
   BALANCED 3D AVATAR TILT EFFECT
   ========================================================= */
function init3DAvatarTilt() {
    const wrapper = document.querySelector('#avatar-3d-wrapper');
    const circle = document.querySelector('#avatar-3d-circle');
    const glare = document.querySelector('.avatar-glare');

    if (!wrapper || !circle) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Balanced tilt range (-20deg to +20deg)
        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        // Micro-smoothing transition for buttery soft tracking
        circle.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease';
        circle.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;

        if (glare) {
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.35), transparent 70%)`;
        }
    });

    wrapper.addEventListener('mouseleave', () => {
        // Restore spring physics transition on exit
        circle.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, background 0.3s ease';
        circle.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

        if (glare) {
            glare.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 70%)`;
        }
    });
}

/* =========================================================
   BALANCED 3D TILT FOR PROJECT CARDS & STAT BOXES
   ========================================================= */
function init3DCardsTilt() {
    const tiltElements = document.querySelectorAll('.project-card, .stat-box');

    tiltElements.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle, premium card tilt range (-7deg to +7deg)
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transition = 'transform 0.08s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });
}