import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Axis helper
const axes = new THREE.AxesHelper(10);
scene.add(axes);

// Group
const group = new THREE.Group();
scene.add(group);

// CUBE
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  new THREE.MeshStandardMaterial({ color: 0x00FF00 }) // green
);
cube.position.x = -12;
group.add(cube);

// CONE
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(5, 10, 32),
  new THREE.MeshStandardMaterial({ color: 0xFFA500 }) // orange
);
cone.position.x = 0;
group.add(cone);

// CYLINDER
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 10, 32),
  new THREE.MeshStandardMaterial({ color: 0x800080 }) // purple
);
cylinder.position.x = 12;
group.add(cylinder);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 15);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
