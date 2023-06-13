import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


//Scene 
const scene = new THREE.Scene();

//Create our sphere (radius, height, width)
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5,
})

//It mesh the geometry and material together
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//lights
const light = new THREE.PointLight(0xfffff, 1, 100);
//light porition for x , y and z position
light.position.set(0, 10, 10);
light.intensity = 1.24;
scene.add(light);

//Camera (PerspectiveCamera)(  focal length, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(
    45, 
    sizes.width/sizes.height, 
    0.1, 
    100
);

//we added the sphere and camera so they are at the same position so to make them see;
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
//for more sharp edges
renderer.setPixelRatio(2);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// canvas.addEventListener('mousemove', () => controls.update());


//Resize so not have to refersh
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera when resize
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

//The sphere size wont change (re render everytime)
const loop = () => {
    // mesh.rotation.x += 0.2
    controls.update();
    renderer.render(scene, camera); 
    window.requestAnimationFrame(loop);
}

loop();

//Timeline magiicc
const t1 = gsap.timeline({ defaults: { duration: 1}});
t1.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1});
t1.fromTo('nav', {y: "-100%"}, { y: '0%'});
t1.fromTo(".title", { opacity: 0}, {opacity : 1});

//Mouse Animation color
let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
    if(mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ];
        //Lets animate the color
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
    }
})