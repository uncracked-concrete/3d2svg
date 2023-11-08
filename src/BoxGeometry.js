import { Quad } from "./Quad.js";
import { TransformObject } from "./TransformObject.js";
import { Vector3 } from "./Vector3D.js";

class BoxGeometry extends TransformObject{
    constructor(width = 1, height = 1, depth = 1, px=0, py=0,pz=0){
        super(px, py, pz)
        this.quads = []
        this.quads.push(new Quad(new Vector3( 0 + this.px,  0 + this.py,  0 + this.pz), new Vector3( width + this.px,  0 + this.py,  0 + this.pz), new Vector3( width + this.px,  0 + this.py,  height + this.pz), new Vector3( 0 + this.px,  0 + this.py,  height + this.pz)))
        this.quads.push(new Quad(new Vector3( 0 + this.px,  depth + this.py ,  0 + this.pz), new Vector3( 0 + this.px,  depth + this.py ,  height + this.pz), new Vector3( width + this.px,  depth + this.py ,  height + this.pz), new Vector3( width + this.px,  depth + this.py ,  0 + this.pz)))
        this.quads.push(new Quad(new Vector3( 0 + this.px,  0 + this.py,  height + this.pz), new Vector3( width + this.px,  0 + this.py,  height + this.pz), new Vector3( width + this.px,  depth + this.py ,  height + this.pz), new Vector3( 0 + this.px,  depth + this.py ,  height + this.pz)))
        this.quads.push(new Quad(new Vector3( 0 + this.px,  0 + this.py,  0 + this.pz), new Vector3( 0 + this.px,  depth + this.py ,  0 + this.pz), new Vector3( width + this.px,  depth + this.py ,  0 + this.pz), new Vector3( width + this.px,  0 + this.py,  0 + this.pz)))
        this.quads.push(new Quad(new Vector3( 0 + this.px,  0 + this.py,  0 + this.pz), new Vector3( 0 + this.px,  0 + this.py,  height + this.pz), new Vector3( 0 + this.px,  depth + this.py ,  height + this.pz), new Vector3( 0 + this.px,  depth + this.py ,  0 + this.pz)))
        this.quads.push(new Quad(new Vector3( width + this.px,  0 + this.py,  0 + this.pz),new Vector3( width + this.px,  depth + this.py ,  0 + this.pz), new Vector3( width + this.px,  depth + this.py ,  height + this.pz),  new Vector3( width + this.px,  0 + this.py,  height + this.pz)))
    }
}
export { BoxGeometry };