let scene = new THREE.Scene();
scene.fog = new THREE.Fog
scene.background = new THREE.Color(0x2e2e2e);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 15;
camera.position.y = 85

let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor("#2e2e2e");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})