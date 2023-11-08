import * as svg3d from "./src/svg3d.js"

let fTheta = 10;

const cube = new svg3d.BoxGeometry(1,1,1,0,0,0);

const scene = new svg3d.Scene();
const renderer = new svg3d.Renderer();
renderer.setSize( 500, 500 );
document.body.appendChild( renderer.domElement );

scene.add(cube)


function animate(timestamp){
    fTheta += 0.1;

    const fps = 25;
    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps);
    renderer.render(scene, {}, fTheta);
}
animate();