import { Vector3 } from "./Vector3D.js";
import { Point } from "./Point.js";
import { Line } from "./Line.js";
import { Face } from "./Face.js";

class Extrusion {
    constructor(points = [], height = 1, cap = true) {
        this.points = [];
        this.edges = [];
        this.faces = [];
        let upperLines = []
        let lowerLines = []
        for (let i = 0; i < points.length; i++) {
            let nextIndex = (i + 1) % points.length; // To close the loop
            this.points.push(new Point(4 * i, new Vector3(points[i].x, points[i].y, 0)));
            this.points.push(new Point(4 * i + 1, new Vector3(points[i].x, points[i].y, height)));
            this.points.push(new Point(4 * i + 2, new Vector3(points[nextIndex].x, points[nextIndex].y, 0)));
            this.points.push(new Point(4 * i + 3, new Vector3(points[nextIndex].x, points[nextIndex].y, height)));

            const upperLine = new Line(4 * i + 1, 4 * i + 1, 4 * i + 3)
            upperLines.push(upperLine)
            const lowerLine = new Line(4 * i + 2, 4 * i + 2, 4 * i)
            lowerLines.push(lowerLine)
            this.edges.push(new Line(4 * i, 4 * i, 4 * i + 1));
            this.edges.push(upperLine);
            this.edges.push(lowerLine)
            this.edges.push(new Line(4 * i + 3, 4 * i + 3, 4 * i + 2));

            this.faces.push(new Face(4 * i, [4 * i + 1, 4 * i + 3, 4 * i + 2, 4 * i]));
        }

        if (cap){
            const currentIndex = Math.max(...this.faces.map(x => x.id))
            this.faces.push(new Face(currentIndex + 1, lowerLines.map(x => x.id)))
            this.faces.push(new Face(currentIndex + 2, upperLines.map(x => x.id).reverse()))
        }
    }
}

export { Extrusion };