import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// =========================
// SETUP DASAR SCENE
// =========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc); // Warna abu-abu terang
scene.fog = new THREE.FogExp2(0xcccccc, 0.08); // Kabut dengan warna yang sama

// Kamera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
const defaultCameraPos = new THREE.Vector3(2, 2, 4);
camera.position.copy(defaultCameraPos);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls Orbit
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();

// =========================
// LIGHTING & FX PANGGUNG
// =========================

// Cahaya lembut umum
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemi);

// Spotlight utama (panggung)
const spot = new THREE.SpotLight(0xffddaa, 3, 30, Math.PI / 6, 0.3);
spot.position.set(4, 8, 4);
spot.target.position.set(0, 1, 0);
scene.add(spot);
scene.add(spot.target);

// Lampu panggung kedua (bergerak pelan)
const movingSpot = new THREE.SpotLight(0xff6666, 1.5, 25, Math.PI / 7, 0.4);
movingSpot.position.set(-5, 6, -3);
movingSpot.target.position.set(0, 1, 0);
scene.add(movingSpot);
scene.add(movingSpot.target);

// Partikel asap panggung sederhana
function createSmokeParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 6;
        const y = Math.random() * 3 + 0.5; // di atas lantai
        const z = (Math.random() - 0.5) * 6;
        positions.push(x, y, z);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffcccc,
        transparent: true,
        opacity: 0.7,
    });

    const points = new THREE.Points(geometry, material);
    points.name = "smokeParticles";
    scene.add(points);
}
createSmokeParticles();

// =========================
// PANGGUNG & LANTAI
// =========================

function createStage() {
    const stageGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 64);
    const stageMat = new THREE.MeshStandardMaterial({
        color: 0x332222,
        roughness: 0.8,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.1; // Sedikit di bawah model Reog
    stage.receiveShadow = true;
    scene.add(stage);
}
createStage();
// =========================
// LOAD MODEL REOG
// =========================

let reogModel = null;
let reogBoundingBox = null;

const loader = new GLTFLoader();
loader.load(
    "/Reog.glb",
    (gltf) => {
        reogModel = gltf.scene;
        reogModel.position.set(0, 0, 0);
        reogModel.scale.set(1, 1, 1);

        // Hitung bounding box untuk penentuan region klik
        reogBoundingBox = new THREE.Box3().setFromObject(reogModel);

        // Aktifkan shadow kalau mau
        reogModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.originalEmissive =
                        child.material.emissive?.clone() || new THREE.Color(0x000000);
                }
            }
        });

        scene.add(reogModel);
        console.log("✔ Reog loaded");
    },
    undefined,
    (err) => {
        console.error("❌ Failed to load GLB:", err);
    }
);

// =========================
// AUDIO (MUSIK & EFEK)
// =========================

const listener = new THREE.AudioListener();
camera.add(listener);

const bgMusic = new THREE.Audio(listener);
const gongSound = new THREE.Audio(listener);
const kendangSound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();

audioLoader.load("/reog-music.mp3", (buffer) => {
    bgMusic.setBuffer(buffer);
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.45);
    createMusicButton(bgMusic);
});

audioLoader.load("/src/assets/gong.mp3", (buffer) => {
    gongSound.setBuffer(buffer);
    gongSound.setLoop(false);
    gongSound.setVolume(0.8);
});

audioLoader.load("/src/assets/kendang.mp3", (buffer) => {
    kendangSound.setBuffer(buffer);
    kendangSound.setLoop(false);
    kendangSound.setVolume(0.5);
});

// =========================
// UI: TITLE & PANEL KONTROL
// =========================

// Judul di atas layar
const title = document.createElement("div");
title.innerHTML = "Reog Ponorogo 3D Interactive Museum";
title.style.position = "absolute";
title.style.top = "20px";
title.style.left = "50%";
title.style.transform = "translateX(-50%)";
title.style.padding = "10px 20px";
title.style.fontSize = "22px";
title.style.color = "white";
title.style.background = "rgba(0,0,0,0.6)";
title.style.borderRadius = "6px";
title.style.fontFamily = "sans-serif";
title.style.zIndex = "1000";
document.body.appendChild(title);

// Panel kontrol kiri bawah
const controlPanel = document.createElement("div");
controlPanel.style.position = "absolute";
controlPanel.style.left = "20px";
controlPanel.style.bottom = "20px";
controlPanel.style.padding = "10px 15px";
controlPanel.style.background = "rgba(0,0,0,0.7)";
controlPanel.style.color = "white";
controlPanel.style.fontFamily = "sans-serif";
controlPanel.style.fontSize = "13px";
controlPanel.style.borderRadius = "8px";
controlPanel.style.zIndex = "1000";
controlPanel.style.maxWidth = "220px";
controlPanel.innerHTML = `
  <div style="font-weight:bold; margin-bottom:8px;">Kontrol Kamera</div>
`;
document.body.appendChild(controlPanel);

function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.marginTop = "5px";
    btn.style.padding = "6px 8px";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.background = "#aa0000";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.onclick = onClick;
    controlPanel.appendChild(btn);
    return btn;
}

// Zoom In/Out/Reset
createButton("Zoom In", () => {
    controls.dollyIn(1.1);
    controls.update();
});
createButton("Zoom Out", () => {
    controls.dollyOut(1.1);
    controls.update();
});
createButton("Reset Kamera", () => {
    camera.position.copy(defaultCameraPos);
    controls.target.set(0, 1, 0);
    controls.update();
});

// Auto Orbit toggle
let autoOrbitEnabled = false;
let autoOrbitAngle = 0;
const autoOrbitBtn = createButton("Auto Orbit: OFF", () => {
    autoOrbitEnabled = !autoOrbitEnabled;
    autoOrbitBtn.innerText = autoOrbitEnabled ? "Auto Orbit: ON" : "Auto Orbit: OFF";
});

// Mode eksplorasi: Orbit vs FPS
let mode = "orbit"; // "orbit" | "fps"
const modeBtn = createButton("Mode: Orbit (Default)", () => {
    if (mode === "orbit") {
        mode = "fps";
        controls.enabled = false;
        modeBtn.innerText = "Mode: First Person";
    } else {
        mode = "orbit";
        controls.enabled = true;
        modeBtn.innerText = "Mode: Orbit (Default)";
    }
});

// Petunjuk kecil
const hint = document.createElement("div");
hint.style.marginTop = "8px";
hint.style.fontSize = "11px";
hint.style.opacity = "0.9";
hint.innerHTML = `
  Orbit: drag mouse<br>
  FPS: W/A/S/D + panah (←↑→↓)<br>
  Klik Reog: info + gong<br>
  Hover: highlight + kendang
`;
controlPanel.appendChild(hint);

// Tombol musik
function createMusicButton(sound) {
    const btn = document.createElement("button");
    btn.innerText = "Play Musik Reog";
    btn.style.position = "absolute";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "14px";
    btn.style.background = "#aa0000";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";
    btn.style.zIndex = "1000";

    btn.onclick = () => {
        if (!sound.isPlaying) {
            sound.play();
            btn.innerText = "Stop Musik Reog";
        } else {
            sound.stop();
            btn.innerText = "Play Musik Reog";
        }
    };

    document.body.appendChild(btn);
}

// =========================
// RAYCASTING: HOVER & KLIK
// =========================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isHoveringReog = false;
let lastHoverSoundTime = 0;

// Highlight: ubah emissive jadi merah keemasan
function setReogHighlight(active) {
    if (!reogModel) return;
    reogModel.traverse((child) => {
        if (child.isMesh && child.material) {
            if (active) {
                child.material.emissive = new THREE.Color(0xff6600);
                child.material.emissiveIntensity = 0.6;
            } else if (child.material.originalEmissive) {
                child.material.emissive.copy(child.material.originalEmissive);
                child.material.emissiveIntensity = 1.0;
            }
        }
    });
}

// Hover
window.addEventListener("mousemove", (event) => {
    if (!reogModel) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(reogModel, true);

    if (intersects.length > 0) {
        if (!isHoveringReog) {
            isHoveringReog = true;
            setReogHighlight(true);

            const now = performance.now();
            if (kendangSound.buffer && now - lastHoverSoundTime > 800) {
                kendangSound.stop();
                kendangSound.play();
                lastHoverSoundTime = now;
            }
        }
    } else {
        if (isHoveringReog) {
            isHoveringReog = false;
            setReogHighlight(false);
        }
    }
});

// Klik: info + gong + label tergantung region
window.addEventListener("click", (event) => {
    if (!reogModel) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(reogModel, true);

    if (intersects.length > 0) {
        // Mainkan gong
        if (gongSound.buffer) {
            gongSound.stop();
            gongSound.play();
        }

        const pointWorld = intersects[0].point.clone();
        const pointLocal = reogModel.worldToLocal(pointWorld);

        let section = "Umum";
        let text = `
      Reog adalah seni pertunjukan tradisional dari Ponorogo, Jawa Timur.
      Pertunjukan melibatkan topeng besar, Warok, Jathilan, dan gamelan.
    `;

        if (reogBoundingBox) {
            const height = reogBoundingBox.max.y - reogBoundingBox.min.y;
            const normY = (pointLocal.y - reogBoundingBox.min.y) / height;

            if (normY > 0.7) {
                section = "Dadak Merak";
                text = `
          <b>Dadak Merak</b> adalah ikon utama Reog Ponorogo.
          Topeng besar dengan bulu merak ini bisa mencapai berat puluhan kilogram,
          dan biasanya dipikul oleh satu penari menggunakan kekuatan gigi.
        `;
            } else if (normY > 0.35) {
                section = "Wajah Barongan / Warok";
                text = `
          Bagian tengah menggambarkan sosok barongan atau Warok,
          tokoh kuat dan sakti dalam tradisi Reog. Warok melambangkan
          penjaga moral dan spiritual masyarakat.
        `;
            } else {
                section = "Kostum & Penari Bawah";
                text = `
          Bagian bawah berisi kostum dan elemen pendukung penari.
          Gerakan penari Jathilan dan pengiring lain memperkuat
          nuansa magis dan heroik dalam pertunjukan Reog.
        `;
            }
        }

        showInfoBox(section, text);
    }
});

function showInfoBox(titleText, contentHtml) {
    let box = document.getElementById("reog-info-box");
    if (!box) {
        box = document.createElement("div");
        box.id = "reog-info-box";
        box.style.position = "absolute";
        box.style.bottom = "20px";
        box.style.left = "250px";
        box.style.padding = "15px";
        box.style.background = "rgba(0,0,0,0.85)";
        box.style.color = "white";
        box.style.fontFamily = "sans-serif";
        box.style.borderRadius = "8px";
        box.style.maxWidth = "320px";
        box.style.lineHeight = "1.4";
        box.style.zIndex = "999";

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Tutup";
        closeBtn.style.marginTop = "10px";
        closeBtn.style.padding = "6px 12px";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.background = "#aa0000";
        closeBtn.style.color = "white";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => box.remove();

        box.appendChild(closeBtn);
        document.body.appendChild(box);
    }

    box.innerHTML = `
    <div style="font-size:16px; font-weight:bold; margin-bottom:6px;">${titleText}</div>
    <div style="font-size:13px; margin-bottom:8px;">${contentHtml}</div>
    <button id="close-info-btn" style="
      margin-top: 5px;
      padding:6px 12px;
      border:none;
      border-radius:4px;
      background:#aa0000;
      color:white;
      cursor:pointer;">
      Tutup
    </button>
  `;

    document.getElementById("close-info-btn").onclick = () => box.remove();
}

// =========================
// MODE FPS: GERAK KAMERA
// =========================

const fpsState = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    rotLeft: false,
    rotRight: false,
    rotUp: false,
    rotDown: false,
};

window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW":
            fpsState.moveForward = true;
            break;
        case "KeyS":
            fpsState.moveBackward = true;
            break;
        case "KeyA":
            fpsState.moveLeft = true;
            break;
        case "KeyD":
            fpsState.moveRight = true;
            break;
        case "ArrowLeft":
            fpsState.rotLeft = true;
            break;
        case "ArrowRight":
            fpsState.rotRight = true;
            break;
        case "ArrowUp":
            fpsState.rotUp = true;
            break;
        case "ArrowDown":
            fpsState.rotDown = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyW":
            fpsState.moveForward = false;
            break;
        case "KeyS":
            fpsState.moveBackward = false;
            break;
        case "KeyA":
            fpsState.moveLeft = false;
            break;
        case "KeyD":
            fpsState.moveRight = false;
            break;
        case "ArrowLeft":
            fpsState.rotLeft = false;
            break;
        case "ArrowRight":
            fpsState.rotRight = false;
            break;
        case "ArrowUp":
            fpsState.rotUp = false;
            break;
        case "ArrowDown":
            fpsState.rotDown = false;
            break;
    }
});

// =========================
// RESPONSIVE
// =========================

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =========================
// ANIMATE LOOP
// =========================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Gerakkan asap pelan naik-turun
    const smoke = scene.getObjectByName("smokeParticles");
    if (smoke) {
        smoke.position.y = Math.sin(elapsed * 0.3) * 0.2;
    }

    // Gerak spotlight kedua
    movingSpot.position.x = Math.sin(elapsed * 0.5) * 6;
    movingSpot.position.z = Math.cos(elapsed * 0.5) * 6;

    // Auto orbit kamera
    if (autoOrbitEnabled && mode === "orbit") {
        autoOrbitAngle += delta * 0.3;
        const radius = 6;
        camera.position.x = Math.cos(autoOrbitAngle) * radius;
        camera.position.z = Math.sin(autoOrbitAngle) * radius;
        camera.position.y = 2.5;
        controls.target.set(0, 1, 0);
    }

    // Rotasi model pelan
    if (reogModel) {
        reogModel.rotation.y += 0.003;
    }

    // Mode FPS gerak kamera
    if (mode === "fps") {
        const moveSpeed = 3 * delta;
        const rotSpeed = 1.5 * delta;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(-1);

        if (fpsState.moveForward) camera.position.addScaledVector(forward, moveSpeed);
        if (fpsState.moveBackward) camera.position.addScaledVector(forward, -moveSpeed);
        if (fpsState.moveLeft) camera.position.addScaledVector(right, -moveSpeed);
        if (fpsState.moveRight) camera.position.addScaledVector(right, moveSpeed);

        if (fpsState.rotLeft) camera.rotation.y += rotSpeed;
        if (fpsState.rotRight) camera.rotation.y -= rotSpeed;
        if (fpsState.rotUp) camera.rotation.x += rotSpeed * 0.5;
        if (fpsState.rotDown) camera.rotation.x -= rotSpeed * 0.5;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
