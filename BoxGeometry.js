import { Quad } from "./Quad.js";
import { Vector3 } from "./Vector3D.js";
class BoxGeometry {
    constructor(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0){
        this.quads = []
        this.quads.push(new Quad(new Vector3(x = 0, y = 0 , z = 0), new Vector3(x = width, y = 0 , z = 0), new Vector3(x = width, y = 0 , z = height), new Vector3(x = 0, y = 0 , z = height)))
        this.quads.push(new Quad(new Vector3(x = 0, y = depth , z = 0), new Vector3(x = width, y = depth , z = 0), new Vector3(x = width, y = depth , z = height), new Vector3(x = 0, y = depth , z = height)))
        this.quads.push(new Quad(new Vector3(x = 0, y = 0 , z = height), new Vector3(x = width, y = 0 , z = height), new Vector3(x = width, y = depth , z = height), new Vector3(x = 0, y = depth , z = height)))
        this.quads.push(new Quad(new Vector3(x = 0, y = 0 , z = 0), new Vector3(x = width, y = 0 , z = 0), new Vector3(x = width, y = depth , z = 0), new Vector3(x = 0, y = depth , z = 0)))
        this.quads.push(new Quad(new Vector3(x = 0, y = 0 , z = 0), new Vector3(x = 0, y = depth , z = 0), new Vector3(x = 0, y = depth , z = height), new Vector3(x = 0, y = 0 , z = height)))
        this.quads.push(new Quad(new Vector3(x = width, y = 0 , z = 0), new Vector3(x = width, y = depth , z = 0), new Vector3(x = width, y = depth , z = height), new Vector3(x = width, y = 0 , z = height)))
console.log(this.quads)
    }
}
export { BoxGeometry };