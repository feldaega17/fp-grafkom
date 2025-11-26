import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// =======================================================
// SETUP DASAR
// =======================================================

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a0000); // merah gelap khas Reog

// Camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(2, 2, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// =======================================================
// LIGHTING
// =======================================================

// Cahaya lembut
scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.2));

// Spotlight panggung Reog
const spot = new THREE.SpotLight(0xffaa55, 3, 20, Math.PI / 6, 0.3);
spot.position.set(2, 5, 3);
spot.target.position.set(0, 0, 0);
scene.add(spot);
scene.add(spot.target);


// =======================================================
// LOAD MODEL GLB REOG
// =======================================================

let reogModel = null;

const loader = new GLTFLoader();
loader.load(
    "/Reog.glb",
    (gltf) => {
        reogModel = gltf.scene;
        reogModel.position.set(0, 0, 0);
        reogModel.scale.set(1, 1, 1);

        scene.add(reogModel);
        console.log("✔ Reog loaded");
    },
    undefined,
    (err) => {
        console.error("❌ Failed to load GLB:", err);
    }
);


// =======================================================
// ANIMASI ROTASI MODEL
// =======================================================

function animate() {
    requestAnimationFrame(animate);

    if (reogModel) {
        reogModel.rotation.y += 0.003; // rotasi halus
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();


// =======================================================
// RESPONSIVE
// =======================================================

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// =======================================================
// UI: JUDUL APLIKASI
// =======================================================

const title = document.createElement("div");
title.innerHTML = "Reog Ponorogo 3D Showcase";
title.style.position = "absolute";
title.style.top = "20px";
title.style.left = "50%";
title.style.transform = "translateX(-50%)";
title.style.padding = "10px 20px";
title.style.fontSize = "22px";
title.style.color = "white";
title.style.background = "rgba(0,0,0,0.5)";
title.style.borderRadius = "6px";
title.style.fontFamily = "sans-serif";
document.body.appendChild(title);


// =======================================================
// POP-UP INFO SAAT DIKLIK
// =======================================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
    if (!reogModel) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(reogModel, true);

    if (intersects.length > 0) {
        showInfoBox();
    }
});

function showInfoBox() {
    if (document.getElementById("reog-info-box")) return;

    const box = document.createElement("div");
    box.id = "reog-info-box";
    box.style.position = "absolute";
    box.style.bottom = "20px";
    box.style.left = "20px";
    box.style.padding = "15px";
    box.style.background = "rgba(0,0,0,0.75)";
    box.style.color = "white";
    box.style.fontFamily = "sans-serif";
    box.style.borderRadius = "8px";
    box.style.maxWidth = "300px";
    box.style.lineHeight = "1.4";
    box.style.zIndex = "999";

    box.innerHTML = `
        <strong style="font-size:18px;">Reog Ponorogo</strong><br><br>
        Reog adalah seni pertunjukan tradisional dari Ponorogo, Jawa Timur.
        Ciri khasnya adalah topeng besar "Dadak Merak", Warok, dan Jathilan,
        serta iringan gamelan khas Reog.<br><br>
        
        <button id="close-info" style="
            padding:8px 15px;
            border:none;
            background:#aa0000;
            color:#fff;
            margin-top:10px;
            border-radius:4px;
            cursor:pointer;
            font-weight:bold;">
            Tutup
        </button>
    `;

    document.body.appendChild(box);
    document.getElementById("close-info").onclick = () => box.remove();
}


// =======================================================
// MUSIK REOG (DENGAN TOMBOL PLAY/STOP)
// =======================================================

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load("/reog-music.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.45);

    // Setelah audio siap → tambahkan tombol
    createMusicButton(sound);
});

function createMusicButton(sound) {
    const btn = document.createElement("button");
    btn.innerText = "Play Musik Reog";
    btn.style.position = "absolute";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
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
            btn.innerText = "Stop Musik";
        } else {
            sound.stop();
            btn.innerText = "Play Musik Reog";
        }
    };

    document.body.appendChild(btn);
}

// =======================================================
// END OF FILE
// =======================================================
