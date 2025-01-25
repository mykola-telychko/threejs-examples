import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// Добавляем освещение
const ambientLight = new THREE.AmbientLight(0xffcc99, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffaa66, 0.7);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Enable AR
const arButton = ARButton.createButton(renderer);
arButton.style.position = 'absolute';
arButton.style.bottom = '20px';
arButton.style.left = '50%';
arButton.style.transform = 'translateX(-50%)';
document.body.appendChild(arButton);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.5;

// Load GLB model
const loader = new GLTFLoader();
let model;

loader.load('/TP.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(0, 0, -0.5);
    model.visible = false;
    scene.add(model);

    setTimeout(() => {
        model.visible = true;
    }, 500);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// AR hit test for placing the model on a surface
const controller = renderer.xr.getController(0);
scene.add(controller);

controller.addEventListener('select', (event) => {
    const hitTestSource = event.target.xrHitTestSource;
    if (hitTestSource && model) {
        const hit = hitTestSource.getHit(0);
        if (hit) {
            model.position.set(hit.transform.position.x, hit.transform.position.y, hit.transform.position.z);
        }
    }
});

let isAnimating = true;
function animate() {
    if (isAnimating && model && model.visible) {
        model.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});

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
