import * as THREE from "./3D2SVG.js"




let fTheta = 0;



let fNear = 0.1;
let fFar = 1000.0;
let fFov = 90;

let sceneWidth = 1;
let sceneHeight = 1;
let fAspectRatio = 1;
let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180 * Math.PI)

let projMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


projMatrix[0] = fAspectRatio * fFovRad;
projMatrix[5] = fFovRad;
projMatrix[10] = fFar / (fFar - fNear);
projMatrix[14] = (-fFar * fNear) / (fFar - fNear);
projMatrix[11] = 1

const cube = new THREE.BoxGeometry(2,1,0.2,0,0,0);
const cube2 = new THREE.BoxGeometry(0.5,0.5,1,0,0,0);
const scene = new THREE.Scene();
scene.add(cube)
scene.add(cube2)

initScene()

function initScene(){
    console.log("Hello")
    let svg = document.getElementById("canvas");
    sceneWidth = svg.getAttribute('width')
    sceneHeight = svg.getAttribute('height')
    fAspectRatio = sceneWidth / sceneHeight


    
}

function MultiplyMatrixVector(input, matrix){
    const output =[0,0,0]
    
    output[0]   = input[0] * matrix[0] + input[1] * matrix[4] + input[2] * matrix[8] + matrix[12];
    output[1]   = input[0] * matrix[1] + input[1] * matrix[5] + input[2] * matrix[9] + matrix[13];
    output[2]   = input[0] * matrix[2] + input[1] * matrix[6] + input[2] * matrix[10] + matrix[14];
    let w       = input[0] * matrix[3] + input[1] * matrix[7] + input[2] * matrix[11] + matrix[15];

    if ( Math.abs(w) !=  0.0){
        output[0] /= w;
        output[1] /= w;
        output[2] /= w;
    }

    return output;
    
}

function DrawLine(p1, p2){

    let matRotZ = [
        Math.cos(fTheta), Math.sin(fTheta),0,0,
        -Math.sin(fTheta), Math.cos(fTheta),0,0,
        0,0,1,0,
        0,0,0,1]
    let matRotX = [
        1,0,0,0,
        0, Math.cos(fTheta * 0.5),Math.sin(fTheta * 0.5),0,
        0,-Math.sin(fTheta * 0.5), Math.cos(fTheta * 0.5),0,
        0,0,0,1]

    p1 = MultiplyMatrixVector(p1, matRotZ);
    p2 = MultiplyMatrixVector(p2, matRotZ);

    p1 = MultiplyMatrixVector(p1, matRotX);
    p2 = MultiplyMatrixVector(p2, matRotX);

    p1 = p1;
    p2 = p2;
    p1[2] += 3.0;
    p2[2] += 3.0;

    p1 = MultiplyMatrixVector(p1, projMatrix);
    p2 = MultiplyMatrixVector(p2, projMatrix);


    p1[0] += 1;
    p1[1] += 1;
    p2[0] += 1;
    p2[1] += 1;

    p1[0] *= 0.5 * sceneWidth;
    p1[1] *= 0.5 * sceneHeight;
    p2[0] *= 0.5 * sceneWidth;
    p2[1] *= 0.5 * sceneHeight;

    let canvas = document.getElementById("container");

    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
    newElement.setAttribute('x1', p1[0]);
    newElement.setAttribute('y1', p1[1]);
    newElement.setAttribute('x2', p2[0]);
    newElement.setAttribute('y2', p2[1]);
    newElement.setAttribute('stroke','black');
    canvas.appendChild(newElement);
}
function drawLoop(timestamp){
    fTheta += 0.1;

    updateCanvas();
    const fps = 25;
    setTimeout(() => {
        requestAnimationFrame(drawLoop);
      }, 1000 / fps);
    
}
requestAnimationFrame(drawLoop);
function updateCanvas(){
    let canvas = document.getElementById("canvas");

    let cont = document.getElementById("container");
    if(cont != undefined){
        canvas.removeChild(cont);
    }
    
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a group in SVG's namespace
    newElement.setAttribute('id','container');

    canvas.appendChild(newElement);
    
    scene.children.forEach(child =>{
        child.quads.forEach(quad =>{
            quad.edges.forEach(edge =>{   
                DrawLine([edge.x1, edge.y1, edge.z1], [edge.x2, edge.y2, edge.z2])
            })
        })
    })
}