import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/Onyx010_1K-PNG_Color.png'); 

const geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);

const material = new THREE.MeshBasicMaterial({
  map: texture
});

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 3, 3);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
