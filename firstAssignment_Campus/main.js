import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3a3f5a);

// Camera
const camera = new THREE.PerspectiveCamera(  
  60,
  window.innerWidth / window.innerHeight,
   0.1,
   1000
  );
camera.position.set(80, 90, 100);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
const hemiLight = new THREE.HemisphereLight(0x555577, 0x111122, 2.5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);


const dirLight = new THREE.DirectionalLight(0xffffff, 0.4); 
dirLight.position.set(50, 50, -50);
dirLight.castShadow = true;
scene.add(dirLight);



const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 5, 0xff0000); 
scene.add(dirLightHelper);



// Grass
const groundMat = new THREE.MeshLambertMaterial({ color: 0x2e8b57 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 150), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Roads (gray)
const roadMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });

const road1 = new THREE.Mesh(new THREE.BoxGeometry(200, 1, 18), roadMat);
road1.position.set(0, 0.5, 60);
road1.receiveShadow = true;
scene.add(road1);

const road2 = new THREE.Mesh(new THREE.BoxGeometry(18, 1, 124), roadMat);
road2.position.set(-50, 0.5, 13);
road2.receiveShadow = true;
scene.add(road2);

const road3 = new THREE.Mesh(new THREE.BoxGeometry(200, 1, 18), roadMat);
road3.position.set(0, 0.5, -40);
scene.add(road3);

const road4 = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 10), roadMat);
road4.position.set(18.5, 0.5, -5);
scene.add(road4);

const road5 = new THREE.Mesh(new THREE.BoxGeometry(18, 1, 150), roadMat);
road5.position.set(83, 0.5, 0);
road5.receiveShadow = true;
scene.add(road5);


// Blue buildings
const blueMat = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 60 });

const blue1 = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 35), blueMat);
blue1.position.set(-80, 8, 28);
blue1.castShadow = true;
scene.add(blue1);

const blue2 = new THREE.Mesh(new THREE.BoxGeometry(15,15, 35), blueMat);
blue2.position.set(-80, 8, -10);
blue2.castShadow = true;
scene.add(blue2);

// Yellow buildings (konviktet)
const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.4 });

const yellow1 = new THREE.Mesh(new THREE.BoxGeometry(45, 20, 15), yellowMat);
yellow1.position.set(-10, 10, -65);
yellow1.castShadow = true;
scene.add(yellow1);

const yellow2 = new THREE.Mesh(new THREE.BoxGeometry(45, 20, 15), yellowMat);
yellow2.position.set(40, 10, -65);
yellow2.castShadow = true;
scene.add(yellow2);

// Light blue building (amfiteatri)
const lightBlueMat = new THREE.MeshPhongMaterial({ color: 0x87ceeb, shininess: 80 });
const lightBlue = new THREE.Mesh(new THREE.BoxGeometry(45, 15, 55), lightBlueMat);
lightBlue.position.set(50, 9, 10);
lightBlue.castShadow = true;
scene.add(lightBlue);

// hanging out area
const grayAreaMat = new THREE.MeshLambertMaterial({ color: 0x696969 });
const grayArea = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), grayAreaMat);
grayArea.position.set(-16, 0.5, 5);
grayArea.receiveShadow = true;
scene.add(grayArea);

// Bench material (dark wood with shading)
const benchesMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x3b2f2f, 
  roughness: 0.6,
  metalness: 0.1 
});

// Create benches
const bench1 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), benchesMaterial);
bench1.position.set(-25, 1.25, -10);
bench1.castShadow = true;
bench1.receiveShadow = true;
scene.add(bench1);
 
//benches in the hanging out area near light blue building
const bench2 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), benchesMaterial);
bench2.position.set(-13, 1.25, -10);
bench2.castShadow = true;
bench2.receiveShadow = true;
scene.add(bench2);

const bench3 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), benchesMaterial);
bench3.position.set(-13, 1.25, 20);
bench3.castShadow = true;
bench3.receiveShadow = true;
scene.add(bench3);

const bench4 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), benchesMaterial);
bench4.position.set(-1, 1.25, 20);
bench4.castShadow = true;
bench4.receiveShadow = true;
scene.add(bench4);

//benches near blue buildings
const bench5 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 10), benchesMaterial);
bench5.position.set(-63, 1.25, 20);
bench5.castShadow = true;
bench5.receiveShadow = true;
scene.add(bench5);

const bench6 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 10), benchesMaterial);
bench6.position.set(-63, 1.25, 35);
bench6.castShadow = true;
bench6.receiveShadow = true;
scene.add(bench6);


const bench7 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 10), benchesMaterial);
bench7.position.set(-63, 1.25, 0);
bench7.castShadow = true;
bench7.receiveShadow = true;
scene.add(bench7);

const bench8 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 10), benchesMaterial);
bench8.position.set(-63, 1.25, -15);
bench8.castShadow = true;
bench8.receiveShadow = true;
scene.add(bench8);



//garbage
const binMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x555555, 
  roughness: 0.3,
  metalness: 0.8
});

//small garbage bins
const bin1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), binMaterial);
bin1.position.set(-32, 1, -10); 
bin1.castShadow = true;
bin1.receiveShadow = true;
scene.add(bin1);

const bin2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), binMaterial);
bin2.position.set(6, 1, 20);
bin2.castShadow = true;
bin2.receiveShadow = true;
scene.add(bin2);

//big garbage bins
const bin3 = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 6, 20), binMaterial);
bin3.position.set(-70, 1, -60);
bin3.castShadow = true;
bin3.receiveShadow = true;
scene.add(bin3);

const bin4 = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 6, 20), binMaterial);
bin4.position.set(-55, 1, -60);
bin4.castShadow = true;
bin4.receiveShadow = true;
scene.add(bin4);


// Street lamp materials
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.4 });
const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffffaa, emissiveIntensity: 1 });

// Lamp 1 
const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole1.position.set(-43, 6, -30); 
pole1.castShadow = true;
scene.add(pole1);

const bulb1 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb1.position.set(-43, 12, -30);
scene.add(bulb1);

const light1 = new THREE.PointLight(0xffffff, 100, 30); 
light1.position.set(-43, 12, -30);
scene.add(light1);


// Lamp 2 
const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole2.position.set(-43, 6, -4); 
pole2.castShadow = true;
scene.add(pole2);

const bulb2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb2.position.set(-43, 12, -4);
scene.add(bulb2);

const light2 = new THREE.PointLight(0xffffff, 100, 30);
light2.position.set(-43, 12, -4);
scene.add(light2);

// Lamp 3 
const pole3 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole3.position.set(-43, 6, 22);
pole3.castShadow = true;
scene.add(pole3);

const bulb3 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb3.position.set(-43, 12, 22);
scene.add(bulb3);

const light3 = new THREE.PointLight(0xffffff, 100, 30);
light3.position.set(-43, 12, 22);
scene.add(light3);

//Lamp 4 
const pole4 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole4.position.set(-43, 6, 50);
pole4.castShadow = true;
scene.add(pole4);

const bulb4 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb4.position.set(-43, 12, 50);
scene.add(bulb4);

const light4 = new THREE.PointLight(0xffffff, 100, 30);
light4.position.set(-43, 12, 50);
scene.add(light4);


//spot light in hanging area

const spotlightPole = new THREE.Mesh( new THREE.CylinderGeometry(0.3, 0.3, 25, 16),poleMaterial);
spotlightPole.position.set(15, 12.5, 5);
spotlightPole.castShadow = true;
scene.add(spotlightPole);

const lampHead = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5),poleMaterial);
lampHead.position.set(15, 25.5, 5); 
scene.add(lampHead);

const spotLight = new THREE.SpotLight(0xffffff, 2000, 60, Math.PI / 6, 0.3);
spotLight.position.set(15, 25.5, 5); 
scene.add(spotLight);

spotLight.target.position.set(-5, 0, 5); 
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//spotlight1
const spotlightPole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 25, 16),poleMaterial);
spotlightPole1.position.set(96, 12.5, -60);
spotlightPole1.castShadow = true;
scene.add(spotlightPole1);

const lampHead1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5),poleMaterial);
lampHead1.position.set(96, 25.5, -60); 
scene.add(lampHead1);

const spotLight1 = new THREE.SpotLight(0xffffff, 2000, 70, Math.PI / 6, 0.3);
spotLight1.position.set(96, 25.5, -60); 
scene.add(spotLight1);

spotLight1.target.position.set(75, 0, -40); 
scene.add(spotLight1.target);

const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
scene.add(spotLightHelper1);

//lights behind light blue building

//lamp 5

const pole5 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole5.position.set(90, 6, -30); 
pole5.castShadow = true;
scene.add(pole5);

const bulb5 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb5.position.set(90, 12, -30);
scene.add(bulb5);

const light5 = new THREE.PointLight(0xffffff, 100, 30); 
light5.position.set(90, 12, -30);
scene.add(light5);


// Lamp 6
const pole6 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole6.position.set(90, 6, -4); 
pole6.castShadow = true;
scene.add(pole6);

const bulb6 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb6.position.set(90, 12, -4);
scene.add(bulb6);

const light6 = new THREE.PointLight(0xffffff, 100, 30);
light6.position.set(90, 12, -4);
scene.add(light6);

// Lamp 7
const pole7 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole7.position.set(90, 6, 22);
pole7.castShadow = true;
scene.add(pole7);

const bulb7 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb7.position.set(90, 12, 22);
scene.add(bulb7);

const light7 = new THREE.PointLight(0xffffff, 100, 30);
light7.position.set(90, 12, 22);
scene.add(light7);

//Lamp 8 
const pole8 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 12), poleMaterial);
pole8.position.set(90, 6, 50);
pole8.castShadow = true;
scene.add(pole8);

const bulb8 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), bulbMaterial);
bulb8.position.set(90, 12, 50);
scene.add(bulb8);

const light8 = new THREE.PointLight(0xffffff, 100, 30);
light8.position.set(90, 12, 50);
scene.add(light8);



// Tree materials
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });

// trees at yellow building
const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk1.position.set(-35, 5, -27);
scene.add(trunk1);
const leaves1 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves1.position.set(-35, 11, -27);
scene.add(leaves1);

const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk2.position.set(-25, 5, -27);
scene.add(trunk2);
const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves2.position.set(-25, 11, -27);
scene.add(leaves2);

const trunk3 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk3.position.set(-15, 5, -27);
scene.add(trunk3);
const leaves3 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves3.position.set(-15, 11, -27);
scene.add(leaves3);

const trunk4 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk4.position.set(-5, 5, -27);
scene.add(trunk4);
const leaves4 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves4.position.set(-5, 11, -27);
scene.add(leaves4);

const trunk5 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk5.position.set(5, 5, -27);
scene.add(trunk5);
const leaves5 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves5.position.set(5, 11, -27);
scene.add(leaves5);

const trunk6 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), treeTrunkMat);
trunk6.position.set(15, 5, -27);
scene.add(trunk6);
const leaves6 = new THREE.Mesh(new THREE.ConeGeometry(4, 12, 8), treeLeavesMat);
leaves6.position.set(15, 11, -27);
scene.add(leaves6);

const trunk7 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk7.position.set(-34, 7, 43);
scene.add(trunk7);
const leaves7 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), treeLeavesMat);
leaves7.position.set(-34, 11, 43);
scene.add(leaves7);

const trunk8 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk8.position.set(-20, 7, 43);
scene.add(trunk8);
const leaves8 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), treeLeavesMat);
leaves8.position.set(-20, 11, 43);
scene.add(leaves8);

const trunk9 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk9.position.set(-4, 7, 43);
scene.add(trunk9);
const leaves9 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), treeLeavesMat);
leaves9.position.set(-4, 11, 43);
scene.add(leaves9);

const trunk10 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk10.position.set(10, 7, 43);
scene.add(trunk10);
const leaves10 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), treeLeavesMat);
leaves10.position.set(10, 11, 43);
scene.add(leaves10);

const trunk11 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk11.position.set(24, 7, 43);
scene.add(trunk11);
const leaves11 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), treeLeavesMat);
leaves11.position.set(24, 11, 43);
scene.add(leaves11);

const trunk12 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk12.position.set(-40, 7, -55);
scene.add(trunk12);
const leaves12 = new THREE.Mesh(new THREE.SphereGeometry(8, 12, 8), treeLeavesMat);
leaves12.position.set(-40, 14, -55);
scene.add(leaves12);

const trunk13 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15), treeTrunkMat);
trunk13.position.set(72, 7, -55);
scene.add(trunk13);
const leaves13 = new THREE.Mesh(new THREE.SphereGeometry(8, 12, 8), treeLeavesMat);
leaves13.position.set(72, 14, -55);
scene.add(leaves13);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});