
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
floor.receiveShadow = true;
scene.add(floor);


const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshLambertMaterial({ color: 0xff66ff });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = -3;
scene.add(torus);


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x800000, 
  metalness: 0.6, 
  roughness: 0.3, 
  wireframe:true 
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;
scene.add(sphere);


const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({
  color:0x8844ff,
  specular:0xffffff,
  shininess:50,
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.x = 3;
scene.add(cylinder);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add(lightHelper);


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  sphere.rotation.y += 0.01;
  cylinder.rotation.x += 0.01;

  renderer.render(scene, camera);
}

animate();

