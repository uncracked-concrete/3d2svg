import { Quad } from "./Quad.js";
import { Vector3 } from "./Vector3D.js";

class BoxGeometry{
    constructor(width = 1, height = 1, depth = 1, px = 0, py= 0, pz= 0 + pz, rx = 0, ry = 0, rz = 0){
        this.quads = []
        this.quads.push(new Quad(new Vector3( 0 + px,  0 + py,  0 + pz), new Vector3( width + px,  0 + py,  0 + pz), new Vector3( width + px,  0 + py,  height + pz), new Vector3( 0 + px,  0 + py,  height + pz)))
        this.quads.push(new Quad(new Vector3( 0 + px,  depth + py ,  0 + pz), new Vector3( width + px,  depth + py ,  0 + pz), new Vector3( width + px,  depth + py ,  height + pz), new Vector3( 0 + px,  depth + py ,  height + pz)))
        this.quads.push(new Quad(new Vector3( 0 + px,  0 + py,  height + pz), new Vector3( width + px,  0 + py,  height + pz), new Vector3( width + px,  depth + py ,  height + pz), new Vector3( 0 + px,  depth + py ,  height + pz)))
        this.quads.push(new Quad(new Vector3( 0 + px,  0 + py,  0 + pz), new Vector3( width + px,  0 + py,  0 + pz), new Vector3( width + px,  depth + py ,  0 + pz), new Vector3( 0 + px,  depth + py ,  0 + pz)))
        this.quads.push(new Quad(new Vector3( 0 + px,  0 + py,  0 + pz), new Vector3( 0 + px,  depth + py ,  0 + pz), new Vector3( 0 + px,  depth + py ,  height + pz), new Vector3( 0 + px,  0 + py,  height + pz)))
        this.quads.push(new Quad(new Vector3( width + px,  0 + py,  0 + pz), new Vector3( width + px,  depth + py ,  0 + pz), new Vector3( width + px,  depth + py ,  height + pz), new Vector3( width + px,  0 + py,  height + pz)))
    }
}
export { BoxGeometry };