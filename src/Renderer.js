import { Vector3 } from "./Vector3D.js";

class Renderer {
    constructor(parameters = {}){
        const svgcanvas = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svgcanvas.style.display = 'block';
        const {
			canvas = svgcanvas,
            fNear = 0.1,
            fFar = 1000,
            fFov = 90,
            sceneWidth = 500,
            sceneHeight = 500,
		} = parameters;
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.fAspectRatio =  sceneWidth / sceneHeight
        this.projMatrix = this.InitProjectionMatrix(this.fAspectRatio, fFov, fNear, fFar)
        this.domElement = canvas;
        this.vCamera = new Vector3(0,0,0)
        this.setSize = function(width, height){
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        }
        this.render = function(scene, camera, theta){
            let cont = this.domElement.firstElementChild;
            if(cont != undefined){
                this.domElement.removeChild(cont);
            }
            
            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a group in SVG's namespace
            newElement.setAttribute('id','container');
        
            this.domElement.appendChild(newElement);
            
            scene.children.forEach(child =>{
                child.quads.forEach(quad =>{
                    this.DrawLine([quad.v1.x, quad.v1.y, quad.v1.z], [quad.v2.x, quad.v2.y, quad.v2.z], [quad.v3.x, quad.v3.y, quad.v3.z], [quad.v4.x, quad.v4.y, quad.v4.z], theta)
                })
            })
        }
    }
    InitProjectionMatrix(fAspectRatio, fFov, fNear, fFar){
        let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180 * Math.PI)
        let projMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        projMatrix[0] = fAspectRatio * fFovRad;
        projMatrix[5] = fFovRad;
        projMatrix[10] = fFar / (fFar - fNear);
        projMatrix[14] = (-fFar * fNear) / (fFar - fNear);
        projMatrix[11] = 1
        return projMatrix
    }
    MultiplyMatrixVector(input, matrix){
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
    DrawLine(p1, p2, p3, p4, fTheta){

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

        p1 = this.MultiplyMatrixVector(p1, matRotZ);
        p2 = this.MultiplyMatrixVector(p2, matRotZ);
        p3 = this.MultiplyMatrixVector(p3, matRotZ);
        p4 = this.MultiplyMatrixVector(p4, matRotZ);
    
        p1 = this.MultiplyMatrixVector(p1, matRotX);
        p2 = this.MultiplyMatrixVector(p2, matRotX);
        p3 = this.MultiplyMatrixVector(p3, matRotX);
        p4 = this.MultiplyMatrixVector(p4, matRotX);
    
        p1[2] += 3.0;
        p2[2] += 3.0;
        p3[2] += 3.0;
        p4[2] += 3.0;

        let line1 = new Vector3(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2])
        let line2 = new Vector3(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2])
        let normal = new Vector3(line1.y * line2.z - line1.z * line2.y, line1.z * line2.x - line1.x * line2.z, line1.x * line2.y - line1.y * line2.x)
        let length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z)
        normal.x = normal.x / length;
        normal.y = normal.y / length;
        normal.z = normal.z / length;

        if (    normal.x * (p2[0] - this.vCamera.x) + 
                normal.y * (p2[1] - this.vCamera.y) +
                normal.z * (p2[2] - this.vCamera.z) < 0.0){
            p1 = this.MultiplyMatrixVector(p1, this.projMatrix);
            p2 = this.MultiplyMatrixVector(p2, this.projMatrix);
            p3 = this.MultiplyMatrixVector(p3, this.projMatrix);
            p4 = this.MultiplyMatrixVector(p4, this.projMatrix);
        
        
            p1[0] += 1;
            p1[1] += 1;
            p2[0] += 1;
            p2[1] += 1;
            p3[0] += 1;
            p3[1] += 1;
            p4[0] += 1;
            p4[1] += 1;
        
            p1[0] *= 0.5 * this.sceneWidth;
            p1[1] *= 0.5 * this.sceneHeight;
            p2[0] *= 0.5 * this.sceneWidth;
            p2[1] *= 0.5 * this.sceneHeight;
            p3[0] *= 0.5 * this.sceneWidth;
            p3[1] *= 0.5 * this.sceneHeight;
            p4[0] *= 0.5 * this.sceneWidth;
            p4[1] *= 0.5 * this.sceneHeight;

            let canvas = document.getElementById("container");
        
            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            newElement.setAttribute('d', `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} L ${p4[0]} ${p4[1]} Z`);
            newElement.setAttribute('stroke','red');
            newElement.setAttribute('fill','none');
            newElement.setAttribute('stroke-linecap','round');
            newElement.setAttribute('stroke-linejoin','round');
            newElement.setAttribute('vector-effect','non-scaling-stroke');
            newElement.setAttribute('stroke-width','1px');
            canvas.appendChild(newElement);
        }
    }
}

export {Renderer};