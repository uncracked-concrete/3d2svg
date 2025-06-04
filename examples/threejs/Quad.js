import { Vector3 } from "./Vector3D.js";
class Quad {
    constructor(vectors = [], midpoint = 0){
        this.points = vectors
        this.midpoint = midpoint
    }
}

export {Quad};