import { Vector3 } from "./Vector3D.js";
import { Quad } from "./Quad.js";
class Renderer {
    constructor(parameters = {}){
        const svgcanvas = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svgcanvas.style.display = 'block';
        const {
			canvas = svgcanvas,
            sceneWidth = 500,
            sceneHeight = 500,
            renderStyle = 'solid',

		} = parameters;
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.domElement = canvas;
        this.renderStyle = renderStyle;
        this.vCamera = new Vector3(0,0,0);
        this.setBackgroundColor = function(topColor, bottomColor){
            this.domElement.style.backgroundImage = `linear-gradient(${topColor},${bottomColor})`
        }
        this.setSize = function(width, height){
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        }
        this.setRenderStyle = function(renderStyle){
            this.renderStyle = renderStyle
        }
        this.render = function(scene, camera, theta){
            let cont = this.domElement.firstElementChild;
            if(cont != undefined){
                this.domElement.removeChild(cont)
            }

                let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a group in SVG's namespace
                newElement.setAttribute('id','container');
            
                this.domElement.appendChild(newElement);

                
            let quads = []

            scene.children.forEach(child =>{
                quads.push(...child.quads)
            })

            let has = []
            quads.forEach(quad =>{
                has.push(this.RotateFaces(quad, theta))
            })
            has.sort((z1, z2) => z2.midpoint - z1.midpoint)

            has.forEach(quad =>{
                this.DrawFace(quad.points, camera.projectionMatrix)
            })
        }
    }
    MultiplyMatrixVector(input, matrix){
        const output = new Vector3(0,0,0)
        
        output.x   = input.x * matrix[0] + input.y * matrix[4] + input.z * matrix[8] + matrix[12];
        output.y  = input.x * matrix[1] + input.y * matrix[5] + input.z * matrix[9] + matrix[13];
        output.z   = input.x * matrix[2] + input.y * matrix[6] + input.z * matrix[10] + matrix[14];
        let w       = input.x * matrix[3] + input.y * matrix[7] + input.z * matrix[11] + matrix[15];
    
        if ( Math.abs(w) !=  0.0){
            output.x /= w;
            output.y /= w;
            output.z /= w;
        }
    
        return output;
    }
    VectorAdd(v1, v2){
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }
    VectorSubtract(v1, v2){
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }
    VectorMultiply(v1, k){
        return new Vector3(v1.x * k, v1.y * k, v1.z * k)
    }
    VectorDivide(v1, k){
        return new Vector3(v1.x / k, v1.y / k, v1.z / k)
    }
    VectorDotProduct(v1, v2){
        return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
    }
    VectorLength(v1){
        return Math.sqrt(this.VectorDotProduct(v1, v1))
    }
    VectorNormalise(v1){
        let l = this.VectorLength(v1)
        return new Vector3(v1.x / l, v1.y / l, v1.z / l)
    }
    VectorCrossProduct(v1, v2){
        let v = new Vector3()
        v.x = v1.y * v2.z - v1.z * v2.y
        v.y = v1.z * v2.x - v1.x * v2.z
        v.z = v1.x * v2.y - v1.y * v2.x
        return v
    }
    RotateFaces(face, fTheta){
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

        let rotatedPoints =[]
        face.points.forEach(vector =>{
            let vec = new Vector3()
            vec = this.MultiplyMatrixVector(vector, matRotZ);
            vec = this.MultiplyMatrixVector(vec, matRotX);
            vec.z += 5.0;
            rotatedPoints.push(vec)
        })
        let midpoint = 0

        if (rotatedPoints.length == 3){
            midpoint=  (rotatedPoints[0].z + rotatedPoints[1].z + rotatedPoints[2].z) /3.0
        }
        else{
            midpoint=   (rotatedPoints[0].z + rotatedPoints[1].z + rotatedPoints[2].z + rotatedPoints[3].z) /4.0
        }
        return new Quad(rotatedPoints, midpoint)
    }
    DrawFace(face, projectionMatrix){  
        let rotatedPoints = face;      
        let normal = new Vector3(0,0,0)
        if (this.renderStyle != 'wireframe'){
            let line1 = this.VectorSubtract(rotatedPoints[1], rotatedPoints[0])
            let line2 = this.VectorSubtract(rotatedPoints[2], rotatedPoints[0])
            normal = this.VectorCrossProduct(line1, line2)
            normal = this.VectorNormalise(normal)
        }
        let vCameraRay = this.VectorSubtract(rotatedPoints[2], this.vCamera)
        if (this.renderStyle == 'wireframe' || this.VectorDotProduct(normal, vCameraRay) < 0.0){

                let dp = 0;
                if(this.renderStyle == 'solid' || this.renderStyle == 'solid lines'){
                let lightDirection = new Vector3(0, 0, -1)
                lightDirection = this.VectorNormalise(lightDirection)

                dp = this.VectorDotProduct(lightDirection, normal)
                    
                }

                let projectedPoints =[]
                rotatedPoints.forEach(vector =>{
                    let vec = new Vector3()
                    vec = this.MultiplyMatrixVector(vector, projectionMatrix);
                    vec.x += 1
                    vec.y += 1
                    vec.x *= 0.5 * this.sceneWidth;
                    vec.y *= 0.5 * this.sceneHeight;
                    projectedPoints.push(vec)
                })

            

            let container = document.getElementById("container");
            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            let pathString = 'M '
            projectedPoints.forEach(vector =>{
                pathString += vector.x
                pathString += ' '
                pathString += vector.y
                pathString += ' L '
            })
            pathString = pathString.slice(0, -2)
            pathString += 'Z'

            newElement.setAttribute('d', pathString);
            if(this.renderStyle == 'wireframe'){
                newElement.setAttribute('stroke','black');
                newElement.setAttribute('fill','none');
            }
            else if(this.renderStyle == 'edges'){
                newElement.setAttribute('stroke','black');
                newElement.setAttribute('fill','white');
            }
            else if(this.renderStyle == 'solid'){
                newElement.setAttribute('fill',`hsl(0,0%,${(dp * 100)}%)`);
            }
            else if(this.renderStyle == 'solid lines'){
                newElement.setAttribute('stroke','black');
                newElement.setAttribute('fill',`hsl(0,0%,${(dp * 100)}%)`);
            }
            
            newElement.setAttribute('stroke-linecap','round');
            newElement.setAttribute('stroke-linejoin','round');
            newElement.setAttribute('vector-effect','non-scaling-stroke');
            newElement.setAttribute('stroke-width','0.5px');
            container.appendChild(newElement);
        }
    }
}

export {Renderer};