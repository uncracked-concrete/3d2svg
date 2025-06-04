import { Vector3 } from 'three';
import { Quad } from './Quad.js';

class ThreeMesh {
  constructor(geometry) {
    this.geometry = geometry; // { points, edges, faces }
    this.quads = [];
  }

  triangulate(worldMatrix) {
    this.quads = [];

    this.geometry.faces.forEach(face => {
      const vectors = [];

      face.lines.forEach(lineId => {
        const line = this.geometry.edges.find(e => e.id === lineId);
        const start = this.geometry.points.find(p => p.id === line.startPoint);
        const end = this.geometry.points.find(p => p.id === line.endPoint);

        const last = vectors[vectors.length - 1];
        const nextPoint = (last && last.id === end.id) ? start : end;

        vectors.push(nextPoint);
      });

      const transformed = vectors.map(p => {
        const v = p.position.clone().applyMatrix4(worldMatrix);
        return new Vector3(v.x, v.y, v.z);
      });

      this.quads.push(new Quad(transformed));
    });
  }
}

export { ThreeMesh };
