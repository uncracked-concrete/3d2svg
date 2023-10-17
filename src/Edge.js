import { Vector3 } from "./Vector3D.js";
class Edge {
    constructor(vector1, vector2){
        this.x1 = vector1.x
        this.y1 = vector1.y
        this.z1 = vector1.z
        this.x2 = vector2.x
        this.y2 = vector2.y
        this.z2 = vector2.z
    }
}

export {Edge};