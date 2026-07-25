(function(){

// ---------- Three.js hero scene: particles + rotating wireframe icosahedron ----------
const container = document.getElementById('hero-3d');
if(container && window.THREE){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle field
    const count = 700;
    const positions = new Float32Array(count * 3);
    for(let i=0;i<count;i++){
        positions[i*3] = (Math.random() - 0.5) * 300;
        positions[i*3+1] = (Math.random() - 0.5) * 140;
        positions[i*3+2] = (Math.random() - 0.5) * 300;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x2c3a52, size: 1.4, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Central wireframe icosahedron (signature 3D element)
    const icoGeo = new THREE.IcosahedronGeometry(16, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, wireframe: true, transparent: true, opacity: 0.55 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    const icoGeo2 = new THREE.IcosahedronGeometry(16.8, 1);
    const icoMat2 = new THREE.MeshBasicMaterial({ color: 0xffd23f, wireframe: true, transparent: true, opacity: 0.18 });
    const ico2 = new THREE.Mesh(icoGeo2, icoMat2);
    scene.add(ico2);

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    container.addEventListener('mousemove', (e)=>{
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - rect.width/2) / rect.width * 2;
        mouseY = (e.clientY - rect.top - rect.height/2) / rect.height * 2;
        targetRotY = mouseX * 0.4;
        targetRotX = mouseY * 0.3;
    });

    function animate(){
        requestAnimationFrame(animate);
        points.rotation.y += 0.0015 + mouseX * 0.004;
        points.rotation.x += 0.0006 + mouseY * 0.008;

        ico.rotation.y += 0.004;
        ico.rotation.x += 0.002;
        ico.rotation.y += (targetRotY - ico.rotation.y) * 0.02;
        ico2.rotation.y = -ico.rotation.y * 0.6;
        ico2.rotation.x = -ico.rotation.x * 0.6;

        renderer.render(scene, camera);
    }

    function onResize(){
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduceMotion){
        animate();
    } else {
        renderer.render(scene, camera);
    }
}

// ---------- VanillaTilt for project cards ----------
if(window.VanillaTilt){
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 12,
        speed: 400,
        scale: 1.02,
        glare: true,
        'max-glare': 0.15
    });
}

// ---------- Subtle profile picture parallax ----------
const profile = document.querySelector('.profile-frame');
if(profile){
    let rafId = null;
    document.addEventListener('mousemove', (e)=>{
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(()=>{
            const rect = profile.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width/2) / rect.width * 8;
            const dy = (e.clientY - rect.top - rect.height/2) / rect.height * 8;
            profile.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        });
    });
    document.addEventListener('mouseleave', ()=>{ profile.style.transform = ''; });
}

// ---------- Scroll-reveal for sections ----------
const revealTargets = document.querySelectorAll('.fade-in');
if('IntersectionObserver' in window && revealTargets.length){
    const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealTargets.forEach(el=> io.observe(el));
} else {
    revealTargets.forEach(el=> el.classList.add('visible'));
}

// ---------- Theme toggle (light/dark) ----------
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle){
    const stored = localStorage.getItem('theme');
    if(stored === 'light'){
        document.body.classList.add('light');
        themeToggle.textContent = '☀️';
    }
    themeToggle.addEventListener('click', ()=>{
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// ---------- Contact form (basic client-side feedback) ----------
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
if(form && status){
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        status.textContent = 'Sending...';
        setTimeout(()=>{
            status.textContent = 'Message sent — thanks for reaching out!';
            form.reset();
        }, 700);
    });
}

})();
