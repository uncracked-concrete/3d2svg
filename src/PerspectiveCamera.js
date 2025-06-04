import {Matrix4} from './Matrix4.js'
import { Vector3 } from './Vector3D.js'

class PerspectiveCamera{
    constructor(fov = 50, aspectRatio = 1, near = 0.1, far = 2000){
        this.fov = fov
        this.aspectRatio = aspectRatio
        this.near = near
        this.far = far
        this.projectionMatrix = null
        this.UpdateProjectionMatrix()
        this.projectionMatrix = new Matrix4();
        this.position = new Vector3(0,0,0);
    }
    UpdateProjectionMatrix(){
        let fFovRad = 1.0 / Math.tan(this.fov * 0.5 / 180 * Math.PI)
        let projMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        projMatrix[0] = fFovRad / this.aspectRatio;
        projMatrix[5] = fFovRad;
        projMatrix[10] = -(this.far + this.near) / (this.far - this.near);
        projMatrix[11] = -1;
        projMatrix[14] = -(2 * this.far * this.near) / (this.far - this.near)
        this.projectionMatrix = new Matrix4().fromArray(projMatrix);
    }
}
export {PerspectiveCamera};