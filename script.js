import * as svg3d from "./src/svg3d.js"
import dat from 'https://cdn.skypack.dev/dat.gui';

let fTheta = 13.3;

const box = new svg3d.Box(1,1,1)
const cube = new svg3d.Mesh(box)
const pyr = new svg3d.Pyramid(1,1,1)
const los = new svg3d.Mesh(pyr)
const scene = new svg3d.Scene();

const container = document.body;
// Create a camera
const fov = 90; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 1000; // the far clipping plane

const camera = new svg3d.PerspectiveCamera(fov, aspect, near, far);
console.log(container.clientHeight)
const renderer = new svg3d.Renderer({renderStyle: 'edges',});
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setBackgroundColor( 'white', 'gainsboro' );
container.appendChild( renderer.domElement );

cube.setPosition(new svg3d.Vector3(1.3,1.3,0))
scene.add(los)
scene.add(cube)

let parameters = [
  {check: false, renderStyle: "wireframe"},
  {check: true, renderStyle: "edges"}, 
  {check: false, renderStyle: "solid"},
  {check: false, renderStyle: "solid lines"}
]
const gui = new dat.GUI()
const rs = gui.addFolder('Render Style')
rs.add(parameters[0], 'check').name('Wireframe').listen().onChange(function(){setChecked(0)});
rs.add(parameters[1], 'check').name('Hidden Lines').listen().onChange(function(){setChecked(1)});
rs.add(parameters[2], 'check').name('Solid').listen().onChange(function(){setChecked(2)}); 
rs.add(parameters[3], 'check').name('Solid Lines').listen().onChange(function(){setChecked(3)}); 
rs.open()
function setChecked( prop ) {
    for (let param in parameters){
      parameters[param].check = false;
    }
    parameters[prop].check = true;
    renderer.setRenderStyle(parameters[prop].renderStyle)
  }

function animate(timestamp){
    fTheta += 0.1;

    const fps = 60;

    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps);
    renderer.render(scene, camera, fTheta);
}
animate();