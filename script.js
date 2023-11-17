import * as svg3d from "./src/svg3d.js"
import dat from 'https://cdn.skypack.dev/dat.gui';

let fTheta = 13.3;

const box = new svg3d.Box(1,1,1)
const cube = new svg3d.Mesh(box)
const pyr = new svg3d.Pyramid(1,1,1)
const los = new svg3d.Mesh(pyr)
const scene = new svg3d.Scene();
const renderer = new svg3d.Renderer({renderStyle: 'edges',});
renderer.setSize( 600, 600 );
renderer.setBackgroundColor( 'white', 'gainsboro' );
document.body.appendChild( renderer.domElement );


cube.setPosition(new svg3d.Vector3(1.3,1.3,0))
scene.add(los)
scene.add(cube)


let parameters = [
  {check: false, renderStyle: "wireframe"},
  {check: true, renderStyle: "edges"}, 
  {check: false, renderStyle: "solid"}
]
const gui = new dat.GUI()
const rs = gui.addFolder('Render Style')
rs.add(parameters[0], 'check').name('Wireframe').listen().onChange(function(){setChecked(0)});
rs.add(parameters[1], 'check').name('Hidden Lines').listen().onChange(function(){setChecked(1)});
rs.add(parameters[2], 'check').name('Solid').listen().onChange(function(){setChecked(2)}); 
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

    const fps = 25;
    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps);
    renderer.render(scene, {}, fTheta);
}
animate();