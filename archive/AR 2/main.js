import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

let isAnimating = false;

function animate() {
    if (isAnimating) {
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Створення кнопок
const controlsDiv = document.createElement('div');
controlsDiv.style.position = 'absolute';
controlsDiv.style.top = '10px';
controlsDiv.style.left = '10px';
controlsDiv.style.zIndex = '100';
document.body.appendChild(controlsDiv);

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.margin = '5px';
    button.addEventListener('click', onClick);
    controlsDiv.appendChild(button);
}

// Обробники подій для кнопок
createButton('Rotate', () => {
    cube.rotation.y += Math.PI / 4;
});

createButton('Scale Up', () => {
    cube.scale.set(cube.scale.x * 1.2, cube.scale.y * 1.2, cube.scale.z * 1.2);
});

createButton('Scale Down', () => {
    cube.scale.set(cube.scale.x / 1.2, cube.scale.y / 1.2, cube.scale.z / 1.2);
});

createButton('Start Animation', () => {
    isAnimating = !isAnimating;
});