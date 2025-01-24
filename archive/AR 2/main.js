import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;  // Переміщаємо камеру так, щоб куб був видимий
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // 
document.body.appendChild(renderer.domElement);

// OrbitControls - start
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Додаємо демпфірування для плавного руху
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.5;
// OrbitControls - end

// button AR
document.body.appendChild(ARButton.createButton(renderer));
const arButton = document.getElementById( 'ARButton' );
arButton.style.color = 'red';

// cube size
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.visible = true; 
scene.add(cube);

let isAnimating = true; // Flag to control animation state

function animate() {
  if (isAnimating) { // Check if animation should run
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// handle reseize
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
controlsDiv.style.display = 'block'; // Показує кнопки на початку
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

createButton('Rotate', () => { cube.rotation.y += Math.PI / 4;});
createButton('Scale Up', () => { cube.scale.multiplyScalar(1.2);});
createButton('Scale Down', () => { cube.scale.multiplyScalar(0.8);});

createButton('Start Animation', () => {
  isAnimating = !isAnimating; // Toggle animation state
  console.log('isAnimating:', isAnimating);
});