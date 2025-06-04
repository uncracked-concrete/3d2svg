import { Object3D, Vector3 } from 'three';
import {Point} from "./../../src/Point.js";
import {Line} from "./../../src/Line.js";
import { Face } from "./../../src/Face.js";
import { Geometry } from './Geometry.js';
import { ThreeMesh} from './ThreeMesh.js';

class ThreeBox extends Object3D {
  constructor(width = 1, height = 1, depth = 1) {
    super();

    this._needsTriangulation = true;

    const points = [
      new Point(0, new Vector3(0, 0, 0)),
      new Point(1, new Vector3(width, 0, 0)),
      new Point(2, new Vector3(width, 0, height)),
      new Point(3, new Vector3(0, 0, height)),
      new Point(4, new Vector3(0, depth, 0)),
      new Point(5, new Vector3(0, depth, height)),
      new Point(6, new Vector3(width, depth, height)),
      new Point(7, new Vector3(width, depth, 0)),
    ];

    const edges = [
      new Line(0, 0, 1), new Line(1, 1, 2), new Line(2, 2, 3), new Line(3, 3, 0),
      new Line(4, 4, 5), new Line(5, 5, 6), new Line(6, 6, 7), new Line(7, 7, 4),
      new Line(8, 0, 4), new Line(9, 1, 7), new Line(10, 2, 6), new Line(11, 3, 5),
    ];

    const faces = [
      new Face(0, [0, 1, 2, 3]),
      new Face(1, [4, 5, 6, 7]),
      new Face(2, [8, 7, 9, 0]),
      new Face(3, [10, 5, 11, 2]),
      new Face(4, [11, 4, 8, 3]),
      new Face(5, [9, 6, 10, 1]),
    ];

    const geometry = new Geometry(points, edges, faces);
    this.mesh = new ThreeMesh(geometry);
  }

  markDirty() {
    this._needsTriangulation = true;
  }

  updateMatrixWorld(force) {
    const matrixChanged = this.matrixWorldNeedsUpdate || force;
    super.updateMatrixWorld(force);

    if ((matrixChanged || this._needsTriangulation) && this.mesh) {
      this.mesh.triangulate(this.matrixWorld);
      this._needsTriangulation = false;
    }
  }

  triangulate() {
    this._needsTriangulation = true;
    this.updateMatrixWorld(true);
  }

  get quads() {
    return this.mesh.quads;
  }
}


export { ThreeBox };

