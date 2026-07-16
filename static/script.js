(function(){
// Lightweight three.js particle background for hero
const container = document.getElementById('hero-3d');
if(container && window.THREE){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 900;
    const positions = new Float32Array(count * 3);
    for(let i=0;i<count;i++){
        positions[i*3] = (Math.random() - 0.5) * 300;
        positions[i*3+1] = (Math.random() - 0.5) * 140;
        positions[i*3+2] = (Math.random() - 0.5) * 300;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, transparent: true, opacity: 0.9 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (e)=>{
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - rect.width/2) / rect.width * 2;
        mouseY = (e.clientY - rect.top - rect.height/2) / rect.height * 2;
    });

    function animate(){
        requestAnimationFrame(animate);
        points.rotation.y += 0.003 + mouseX * 0.01;
        points.rotation.x += 0.001 + mouseY * 0.02;
        renderer.render(scene, camera);
    }

    function onResize(){
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);
    animate();
}

// VanillaTilt for project cards
if(window.VanillaTilt){
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 20,
        speed: 5000,
        scale: 1.03,
        glare: true,
        'max-glare': 0.18
    });
}

// Subtle profile picture parallax
const profile = document.querySelector('.profile-pic');
if(profile){
    let rafId = null;
    document.addEventListener('mousemove', (e)=>{
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(()=>{
            const rect = profile.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width/2) / rect.width * 10;
            const dy = (e.clientY - rect.top - rect.height/2) / rect.height * 10;
            profile.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
        });
    });
    document.addEventListener('mouseleave', ()=>{ profile.style.transform = ''; });
}

})();
