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
                    quad.edges.forEach(edge =>{   
                        this.DrawLine([edge.x1, edge.y1, edge.z1], [edge.x2, edge.y2, edge.z2], theta)
                    })
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
    DrawLine(p1, p2, fTheta){

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
    
        p1 = this.MultiplyMatrixVector(p1, matRotX);
        p2 = this.MultiplyMatrixVector(p2, matRotX);
    
        p1 = p1;
        p2 = p2;
        p1[2] += 3.0;
        p2[2] += 3.0;
    
        p1 = this.MultiplyMatrixVector(p1, this.projMatrix);
        p2 = this.MultiplyMatrixVector(p2, this.projMatrix);
    
    
        p1[0] += 1;
        p1[1] += 1;
        p2[0] += 1;
        p2[1] += 1;
    
        p1[0] *= 0.5 * this.sceneWidth;
        p1[1] *= 0.5 * this.sceneHeight;
        p2[0] *= 0.5 * this.sceneWidth;
        p2[1] *= 0.5 * this.sceneHeight;

        let canvas = document.getElementById("container");
    
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
        newElement.setAttribute('x1', p1[0]);
        newElement.setAttribute('y1', p1[1]);
        newElement.setAttribute('x2', p2[0]);
        newElement.setAttribute('y2', p2[1]);
        newElement.setAttribute('stroke','black');
        newElement.setAttribute('stroke-linecap','round');
        newElement.setAttribute('vector-effect','non-scaling-stroke');
        newElement.setAttribute('stroke-width','1px');
        canvas.appendChild(newElement);
    }
}

export {Renderer};