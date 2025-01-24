import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.5;

// button AR
document.body.appendChild(ARButton.createButton(renderer));
const arButton = document.getElementById('ARButton');
arButton.style.color = 'red';

// Load GLB model
const loader = new GLTFLoader();
let model;

loader.load('/3d/TP.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    scene.add(model);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

let isAnimating = true;

function animate() {
    if (isAnimating && model) {
        model.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// handle resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const controlsDiv = document.createElement('div');
controlsDiv.style.position = 'absolute';
controlsDiv.style.top = '10px';
controlsDiv.style.left = '10px';
controlsDiv.style.zIndex = '100';
controlsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
controlsDiv.style.padding = '10px';
document.body.appendChild(controlsDiv);

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.margin = '5px';
    button.style.padding = '10px';
    button.addEventListener('click', onClick);
    controlsDiv.appendChild(button);
}

createButton('Rotate', () => { if (model) model.rotation.y += Math.PI / 4; });
createButton('Scale Up', () => { if (model) model.scale.multiplyScalar(1.2); });
createButton('Scale Down', () => { if (model) model.scale.multiplyScalar(0.8); });
createButton('Toggle Animation', () => { isAnimating = !isAnimating; });
