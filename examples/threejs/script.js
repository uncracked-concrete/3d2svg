import * as THREE from 'three';
import {ThreeBox} from './Box.js'
import {ThreeRenderer} from './ThreeRenderer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let parameters = [
  {check: false, renderStyle: "wireframe"},
  {check: true, renderStyle: "edges"}, 
  {check: false, renderStyle: "solid"},
  {check: false, renderStyle: "solid lines"}, 
  {lowerBound: 0, min: 0, max: 99},
  {upperBound: 100, min: 1, max: 100},
  {steps: 0, min: 0, max: 5},
  {strokeWidth: 0.5, min: 0.5, max: 5, steps: 0.5}
]
const gui = new dat.GUI()
const rs = gui.addFolder('Render Style')
rs.add(parameters[0], 'check').name('Wireframe').listen().onChange(function(){setChecked(0)});
rs.add(parameters[1], 'check').name('Hidden Lines').listen().onChange(function(){setChecked(1)});
rs.add(parameters[2], 'check').name('Solid').listen().onChange(function(){setChecked(2)}); 
rs.add(parameters[3], 'check').name('Solid Lines').listen().onChange(function(){setChecked(3)}); 
rs.open()

const shading = gui.addFolder('Shading')
shading.add(parameters[4], 'lowerBound', 0, 100).name('Lower Bound').onChange(updateBounds);
shading.add(parameters[5], 'upperBound', 0, 100).name('Upper Bound').onChange(updateBounds);
shading.add(parameters[6], 'steps', 0, 5).name('Steps').step(1).onChange(updateBounds);
shading.add(parameters[7], 'strokeWidth', 0.5, 5, 0.5).name('Stroke Width').onChange(updateBounds);
shading.open();

function setChecked( prop ) {
    for (let param in parameters){
      parameters[param].check = false;
    }
    parameters[prop].check = true;
    renderer.setRenderStyle(parameters[prop].renderStyle)
  }
  
function updateBounds() {
  const lowerBound = parameters[4].lowerBound;
  const upperBound = parameters[5].upperBound;
  const steps = parameters[6].steps;
  const width = parameters[7].strokeWidth;
  renderer.setShadingStyle(lowerBound, upperBound, steps)
  renderer.setStrokeWidth(width)
}



const scene = new THREE.Scene();
// Parameters
const boxCount = 10;
const clusterCenter = new THREE.Vector3(0, 0, 0);
const clusterRadius = 15;

for (let i = 0; i < boxCount; i++) {
  // Random dimensions between 0.5 and 2
  const width = 0.5 + Math.random() * 1.5;
  const height = 0.5 + Math.random() * 1.5;
  const depth = 0.5 + Math.random() * 1.5;

  const box = new ThreeBox(width, height, depth);

  // Random position within a sphere around the cluster center
  const offset = new THREE.Vector3(
    (Math.random() - 0.5) * clusterRadius,
    (Math.random() - 0.5) * clusterRadius,
    (Math.random() - 0.5) * clusterRadius
  );

  box.position.copy(clusterCenter.clone().add(offset));
  scene.add(box);
}



const container = document.body;
const renderer = new ThreeRenderer({renderStyle: 'edges',});
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setBackgroundColor( 'white', 'gainsboro' );
container.appendChild( renderer.domElement );






//const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

let lastTimestamp = 0;

scene.updateMatrixWorld(true);


function animate(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // in seconds
    lastTimestamp = timestamp;
    

  controls.update(); 

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
