import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

// Check if the device is iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// If it's an iPhone → Open AR Quick Look
if (isIOS) {
    const usdzUrl = 'ANIME.usdz'; // USDZ model (export from Blender)
    const arLink = document.createElement('a');
    arLink.rel = 'ar';
    arLink.href = usdzUrl;
    arLink.innerHTML = '👀 Open in AR';
    arLink.style.position = 'absolute';
    arLink.style.top = '10px';
    arLink.style.left = '10px';
    arLink.style.padding = '10px';
    arLink.style.background = 'white';
    arLink.style.color = 'black';
    arLink.style.borderRadius = '5px';
    document.body.appendChild(arLink);
} else {
    // WebXR for Android
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add "Enter AR" button
    document.body.appendChild(ARButton.createButton(renderer));

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 0.5));

    // Load GLB model
    const loader = new GLTFLoader();
    let model, mixer;

    loader.load(
        'ANIME.glb', // Specify the path to the model
        (gltf) => {
            model = gltf.scene;

            // Set default size for the model
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Scale the model to 8 times its original size
            const scaleFactor = (8 * 1) / Math.max(size.x, size.y, size.z); // 8 times larger
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Center the model
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);

            scene.add(model);

            if (gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        },
        (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% complete`),
        (error) => console.error('Error loading model:', error)
    );

    // Animation
    const clock = new THREE.Clock();
    function animate() {
        renderer.setAnimationLoop(() => {
            if (mixer) mixer.update(clock.getDelta());
            renderer.render(scene, camera);
        });
    }
    animate();
}