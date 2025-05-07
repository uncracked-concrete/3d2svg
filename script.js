import * as svg3d from "./src/svg3d.js"
import dat from 'https://cdn.skypack.dev/dat.gui';

let fTheta = 13.3;

const box = new svg3d.Box(1,1,1)
const cube = new svg3d.Mesh(box)
const pyr = new svg3d.Pyramid(1,1,1)
const los = new svg3d.Mesh(pyr)
const extr = new svg3d.Extrusion([new svg3d.Vector3(3,3,0), new svg3d.Vector3(3,4,0), new svg3d.Vector3(4,4,0), new svg3d.Vector3(4,3.5,0), new svg3d.Vector3(3.5,3.5,0), new svg3d.Vector3(3.5,3,0)], 0.3)
const extrm = new svg3d.Mesh(extr)
const scene = new svg3d.Scene();

const container = document.body;
// Create a camera
const fov = 90; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 1000; // the far clipping plane

const camera = new svg3d.PerspectiveCamera(fov, aspect, near, far);

const renderer = new svg3d.Renderer({renderStyle: 'edges',});
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setBackgroundColor( 'white', 'gainsboro' );
container.appendChild( renderer.domElement );

cube.setPosition(new svg3d.Vector3(1.3,1.3,0))
scene.add(los)
scene.add(cube)
scene.add(extrm)

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
  

function animate(timestamp){
    fTheta += 0.03;

    const fps = 60;

    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps);
    renderer.render(scene, camera, fTheta);
}
animate();


window.addEventListener('resize', () => {
  camera.aspectRatio = container.clientWidth / container.clientHeight;
  camera.UpdateProjectionMatrix();
  renderer.setSize( container.clientWidth,  container.clientHeight);
  });
  