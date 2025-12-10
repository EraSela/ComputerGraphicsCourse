import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 600);
document.getElementById("scene").appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  renderer.domElement.width / renderer.domElement.height,
  0.1,
  100
);
camera.position.set(1, 0, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// GUI
const gui = new GUI();
const cubeInfo = {
  posX: 0,
  posY: 0,
  posZ: 0,
  width: 0,
  height: 0,
  depth: 0,
  message: "Click a cube to see its info"
};

gui.add(cubeInfo, "posX").name("Position X").listen();
gui.add(cubeInfo, "posY").name("Position Y").listen();
gui.add(cubeInfo, "posZ").name("Position Z").listen();
gui.add(cubeInfo, "width").name("Width").listen();
gui.add(cubeInfo, "height").name("Height").listen();
gui.add(cubeInfo, "depth").name("Depth").listen();
gui.add(cubeInfo, "message").name("Info").listen();

// Cubes
const cubes = [];
let lastSelectedCube = null;
let lastColor = null;
let animationCube = null;
let animationProgress = 0;
let animating = false;

for (let i = 0; i < 30; i++) {
  const size = randBetween(0.2, 1);
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(randBetween(-4, 4), randBetween(-4, 4), randBetween(-5, 0));
  cube.userData.size = size;
  cube.userData.originalColor = cube.material.color.clone();

  cubes.push(cube);
  scene.add(cube);
}

// Click
renderer.domElement.addEventListener("click", (event) => {
  mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes);

  if (intersects.length > 0) {
    const cube = intersects[0].object;

    // Reset previous selection
    if (lastSelectedCube && lastSelectedCube !== cube) {
      lastSelectedCube.material.color.copy(lastSelectedCube.userData.originalColor);
    }

    lastSelectedCube = cube;
    lastColor = cube.material.color.clone();

    // Smooth color transition setup
    cube.material.color.set(0xffffff);

    // Animate scale
    animationCube = cube;
    animationProgress = 0;
    animating = true;

    // Update GUI info (rounded to 2 decimals)
    cubeInfo.posX = parseFloat(cube.position.x.toFixed(2));
    cubeInfo.posY = parseFloat(cube.position.y.toFixed(2));
    cubeInfo.posZ = parseFloat(cube.position.z.toFixed(2));
    cubeInfo.width = parseFloat(cube.geometry.parameters.width.toFixed(2));
    cubeInfo.height = parseFloat(cube.geometry.parameters.height.toFixed(2));
    cubeInfo.depth = parseFloat(cube.geometry.parameters.depth.toFixed(2));
    cubeInfo.message = "Cube selected";

  } else {
    if (lastSelectedCube) {
      lastSelectedCube.material.color.copy(lastSelectedCube.userData.originalColor);
      lastSelectedCube = null;
    }

    // Reset GUI info
    cubeInfo.posX = cubeInfo.posY = cubeInfo.posZ = 0;
    cubeInfo.width = cubeInfo.height = cubeInfo.depth = 0;
    cubeInfo.message = "No object selected";
  }
});

// Animate
function animate() {
  controls.update();

  // Animate cube scaling (bounce)
  if (animating && animationCube) {
    animationProgress += 0.05; // speed
    const scale = 1 + 0.3 * Math.sin(Math.PI * animationProgress); // bounce effect
    animationCube.scale.set(scale, scale, scale);

    if (animationProgress >= 1) {
      animationCube.scale.set(1, 1, 1); // reset scale
      animating = false;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Helpers
function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  return Math.random() * 0xffffff;
}
