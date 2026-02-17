import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


// ---------- Paths (Vite) ----------
const TEX_ROCK = new URL("./textures/rock_surface_diff_4k.jpg", import.meta.url);
const MODEL = "/assets/Object.glb"; // /public/assets/Object.glb

// ---------- Renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

// ---------- Scene ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
scene.fog = new THREE.Fog(0xf0f0f0, 900, 3200);

// ---------- Camera ----------
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.set(0, 560, 880);

// ---------- Controls ----------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 120, 0);
controls.update();

// ---------- Lights ----------
scene.add(new THREE.HemisphereLight(0xffffff, 0x6f7b86, 0.95));

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(650, 1000, 450);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.near = 50;
sun.shadow.camera.far = 3500;
sun.shadow.camera.left = -1200;
sun.shadow.camera.right = 1200;
sun.shadow.camera.top = 1200;
sun.shadow.camera.bottom = -1200;
scene.add(sun);

// ---------- Textures ----------
const tLoader = new THREE.TextureLoader();

function setupRepeatTexture(tex, repeatX, repeatY) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.min(12, renderer.capabilities.getMaxAnisotropy());
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const rockTex = setupRepeatTexture(tLoader.load(TEX_ROCK.href), 6, 6);

// ============================================================
// OCEAN: PHONG 
// ============================================================

const OCEAN_Y = 10.5;

const waterGeo = new THREE.PlaneGeometry(1600 * 8, 1600 * 8, 1, 1);
waterGeo.rotateX(-Math.PI / 2);

const waterMat = new THREE.MeshPhongMaterial({
  color: 0x2b86b8,
  shininess: 120,
  specular: 0x99ddff,
  transparent: true,
  opacity: 0.95,
});

const ocean = new THREE.Mesh(waterGeo, waterMat);
ocean.position.y = OCEAN_Y;
ocean.receiveShadow = false;
scene.add(ocean);

// ============================================================
// RELIEF CLIFF 
// ============================================================

function createReliefCliffUnderModel(
  model,
  {
    pad = 16,
    seg = 200,
    falloff = 75,
    dropDepth = 210,
    topNudge = -1.1,
    noiseAmp = 6,
    noiseFreq = 0.055,
    distBlurIters = 2,
    heightDiffuseIters = 10,
    cutoffMul = 1.05,
    deepExtra = 160,
  } = {}
) {
  model.updateWorldMatrix(true, true);

  const meshes = [];
  model.traverse((o) => {
    if (o.isMesh) meshes.push(o);
  });

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const extra = falloff + 12;
  const W = size.x + (pad + extra) * 2;
  const D = size.z + (pad + extra) * 2;

  const geo = new THREE.PlaneGeometry(W, D, seg, seg);
  geo.rotateX(-Math.PI / 2);
  geo.translate(center.x, 0, center.z);

  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  const raycaster = new THREE.Raycaster();
  const rayOrigin = new THREE.Vector3();
  const rayDir = new THREE.Vector3(0, -1, 0);
  const yFrom = box.max.y + 800;

  const isLand = new Uint8Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    rayOrigin.set(v.x, yFrom, v.z);
    raycaster.set(rayOrigin, rayDir);

    const hits = raycaster.intersectObjects(meshes, true);
    if (hits.length) {
      pos.setY(i, hits[0].point.y + topNudge);
      isLand[i] = 1;
    } else {
      pos.setY(i, OCEAN_Y-0.6);
      isLand[i] = 0;
    }
  }

  const N = seg + 1;
  let dist = new Float32Array(pos.count);
  dist.fill(1e9);

  const q = new Int32Array(pos.count);
  let qs = 0,
    qe = 0;

  for (let i = 0; i < pos.count; i++) {
    if (isLand[i]) {
      dist[i] = 0;
      q[qe++] = i;
    }
  }

  const push = (idx, nd) => {
    if (nd < dist[idx]) {
      dist[idx] = nd;
      q[qe++] = idx;
    }
  };

  while (qs < qe) {
    const idx = q[qs++];
    const d0 = dist[idx];
    const x = idx % N;
    const z = (idx / N) | 0;

    if (x > 0) push(idx - 1, d0 + 1);
    if (x < N - 1) push(idx + 1, d0 + 1);
    if (z > 0) push(idx - N, d0 + 1);
    if (z < N - 1) push(idx + N, d0 + 1);
  }

  for (let it = 0; it < distBlurIters; it++) {
    const nd = new Float32Array(dist.length);
    nd.set(dist);
    for (let zi = 1; zi < N - 1; zi++) {
      for (let xi = 1; xi < N - 1; xi++) {
        const idx = zi * N + xi;
        if (isLand[idx]) continue;

        let sum = 0,
          c = 0;
        for (let dz = -1; dz <= 1; dz++) {
          for (let dx = -1; dx <= 1; dx++) {
            const j = (zi + dz) * N + (xi + dx);
            sum += dist[j];
            c++;
          }
        }
        nd[idx] = Math.min(dist[idx], sum / c);
      }
    }
    dist = nd;
  }

  const cell = Math.min(W / seg, D / seg);
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (a, b, x) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  for (let it = 0; it < heightDiffuseIters; it++) {
    const yNew = new Float32Array(pos.count);

    for (let zi = 0; zi < N; zi++) {
      for (let xi = 0; xi < N; xi++) {
        const idx = zi * N + xi;
        const y0 = pos.getY(idx);

        if (isLand[idx]) {
          yNew[idx] = y0;
          continue;
        }

        let sum = y0,
          c = 1;
        if (xi > 0) {
          sum += pos.getY(idx - 1);
          c++;
        }
        if (xi < N - 1) {
          sum += pos.getY(idx + 1);
          c++;
        }
        if (zi > 0) {
          sum += pos.getY(idx - N);
          c++;
        }
        if (zi < N - 1) {
          sum += pos.getY(idx + N);
          c++;
        }

        yNew[idx] = THREE.MathUtils.lerp(y0, sum / c, 0.55);
      }
    }

    for (let i = 0; i < pos.count; i++) pos.setY(i, yNew[i]);
  }

  const hash = (n) => {
    const s = Math.sin(n) * 43758.5453123;
    return s - Math.floor(s);
  };
  const noise2 = (x, z) => {
    const ix = Math.floor(x),
      iz = Math.floor(z);
    const fx = x - ix,
      fz = z - iz;

    const a = hash(ix * 127.1 + iz * 311.7);
    const b = hash((ix + 1) * 127.1 + iz * 311.7);
    const c = hash(ix * 127.1 + (iz + 1) * 311.7);
    const d = hash((ix + 1) * 127.1 + (iz + 1) * 311.7);

    const u = fx * fx * (3 - 2 * fx);
    const vv = fz * fz * (3 - 2 * fz);
    return (a * (1 - u) + b * u) * (1 - vv) + (c * (1 - u) + d * u) * vv;
  };
  const fbm = (x, z) => {
    let out = 0,
      a = 0.5,
      f = 1.0;
    for (let i = 0; i < 5; i++) {
      out += noise2(x * f, z * f) * a;
      a *= 0.5;
      f *= 2.0;
    }
    return out;
  };

  const cutoff = falloff * cutoffMul;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    if (isLand[i]) continue;

    const dWorld = dist[i] * cell;

    if (dWorld > cutoff) {
      v.x = THREE.MathUtils.lerp(v.x, center.x, 0.85);
      v.z = THREE.MathUtils.lerp(v.z, center.z, 0.85);
      v.y = OCEAN_Y - (dropDepth + deepExtra);
      pos.setXYZ(i, v.x, v.y, v.z);
      continue;
    }

    let tToWater = smoothstep(0, falloff, dWorld);
    tToWater = Math.pow(tToWater, 1.25);

    const ySlope = lerp(v.y, OCEAN_Y, tToWater);
    const deepT = smoothstep(falloff * 0.72, cutoff, dWorld);

    const n = (fbm(v.x * noiseFreq, v.z * noiseFreq) - 0.5) * 2.0;
    const rough = n * noiseAmp * deepT;

    const below = lerp(0, dropDepth, deepT);

    v.y = ySlope - below + rough * 0.14;
    v.x += rough * 0.08;
    v.z += rough * 0.08;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    map: rockTex,
    roughness: 1.0,
    metalness: 0.0,
  });

  const cliff = new THREE.Mesh(geo, mat);
  cliff.castShadow = true;
  cliff.receiveShadow = true;
  return cliff;
}

// ---------- Load GLB + build cliff ----------
const loader = new GLTFLoader();

loader.load(
  MODEL,
  (gltf) => {
    const model = gltf.scene;

    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    scene.add(model);

    const box0 = new THREE.Box3().setFromObject(model);
    const center0 = box0.getCenter(new THREE.Vector3());
    model.position.sub(center0);

    model.updateWorldMatrix(true, true);
    const box1 = new THREE.Box3().setFromObject(model);
    const desiredMinY = OCEAN_Y + 1.2;
    const dy = desiredMinY - box1.min.y;
    model.position.y += dy;

    model.position.y -= 1.15;

    const cliff = createReliefCliffUnderModel(model, {
      pad: 16,
      seg: 200,
      falloff: 55,
      dropDepth: 210,
      topNudge: -1.1,
      noiseAmp: 6,
      noiseFreq: 0.055,
      distBlurIters: 2,
      heightDiffuseIters: 10,
      cutoffMul: 1.05,
      deepExtra: 160,
    });
    scene.add(cliff);

    model.updateWorldMatrix(true, true);
    const boxF = new THREE.Box3().setFromObject(model);
    const sizeF = boxF.getSize(new THREE.Vector3());
    const centerF = boxF.getCenter(new THREE.Vector3());
    const maxDim = Math.max(sizeF.x, sizeF.y, sizeF.z);

    controls.target.copy(centerF);
    controls.target.y += maxDim * 0.12;

    camera.position.set(
      centerF.x + maxDim * 0.9,
      centerF.y + maxDim * 0.6,
      centerF.z + maxDim * 1.15
    );

    controls.update();
  },
  undefined,
  (err) => console.error("GLB load error:", err)
);

// ---------- Resize ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Animate ----------
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
