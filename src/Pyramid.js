import { Vector3 } from "./Vector3D.js";
import {Point} from "./Point.js";
import {Line} from "./Line.js";
import { Face } from "./Face.js";

class Pyramid{
    constructor(width = 1, height = 1, depth = 1,){
        this.points = []
        this.points.push(new Point(0, new Vector3(0,0,0)))
        this.points.push(new Point(1, new Vector3(width,0,0)))
        this.points.push(new Point(2, new Vector3(width,depth,0)))
        this.points.push(new Point(3, new Vector3(0,depth,0)))
        this.points.push(new Point(4, new Vector3(width / 2,depth / 2, height)))
        this.edges = []
        this.edges.push(new Line(0, 0, 1))
        this.edges.push(new Line(1, 1, 2))
        this.edges.push(new Line(2, 2, 3))
        this.edges.push(new Line(3, 3, 0))
        this.edges.push(new Line(4, 0, 4))
        this.edges.push(new Line(5, 1, 4))
        this.edges.push(new Line(6, 2, 4))
        this.edges.push(new Line(7, 3, 4))
        this.faces = []
        this.faces.push(new Face(0,[0,3,2,1]))
        this.faces.push(new Face(1,[0,1,4]))
        this.faces.push(new Face(2,[1,2,4]))
        this.faces.push(new Face(3,[2,3,4]))
        this.faces.push(new Face(4,[3,0,4]))
    }
}
export { Pyramid };