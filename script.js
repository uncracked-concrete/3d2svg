import * as svg3d from "./3D2SVG.js"

let fTheta = 0;

const cube = new svg3d.BoxGeometry(2,1,0.2,0,0,0);
const cube2 = new svg3d.BoxGeometry(0.5,0.5,1,0,0,0);
const scene = new svg3d.Scene();
const renderer = new svg3d.Renderer();
renderer.setSize( 500, 500 );
document.body.appendChild( renderer.domElement );

scene.add(cube)
scene.add(cube2)

function animate(timestamp){
    fTheta += 0.1;

    const fps = 25;
    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps);

    renderer.render(scene, {}, fTheta);
}
animate();