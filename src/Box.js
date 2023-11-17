import { Vector3 } from "./Vector3D.js";
import {Point} from "./Point.js";
import {Line} from "./Line.js";
import { Face } from "./Face.js";

class Box{
    constructor(width = 1, height = 1, depth = 1,){
        this.points = []
        this.points.push(new Point(0, new Vector3(0,0,0)))
        this.points.push(new Point(1, new Vector3(width,0,0)))
        this.points.push(new Point(2, new Vector3(width,0,height)))
        this.points.push(new Point(3, new Vector3(0,0,height)))
        this.points.push(new Point(4, new Vector3(0,depth,0)))
        this.points.push(new Point(5, new Vector3(0,depth,height)))
        this.points.push(new Point(6, new Vector3(width,depth,height)))
        this.points.push(new Point(7, new Vector3(width,depth,0)))
        this.edges = []
        this.edges.push(new Line(0, 0, 1))
        this.edges.push(new Line(1, 1, 2))
        this.edges.push(new Line(2, 2, 3))
        this.edges.push(new Line(3, 3, 0))
        this.edges.push(new Line(4, 4, 5))
        this.edges.push(new Line(5, 5, 6))
        this.edges.push(new Line(6, 6, 7))
        this.edges.push(new Line(7, 7, 4))
        this.edges.push(new Line(8, 0, 4))
        this.edges.push(new Line(9, 1, 7))
        this.edges.push(new Line(10, 2, 6))
        this.edges.push(new Line(11, 3, 5))
        this.faces = []
        this.faces.push(new Face(0,[0,1,2,3]))
        this.faces.push(new Face(1,[4,5,6,7]))
        this.faces.push(new Face(2,[8,7,9,0]))
        this.faces.push(new Face(3,[10,5,11,2]))
        this.faces.push(new Face(4,[11,4,8,3]))
        this.faces.push(new Face(5,[9,6,10,1]))
    }
}
export { Box };