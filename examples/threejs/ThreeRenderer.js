import * as THREE from 'three';
import { Quad } from "./Quad.js";

class ThreeRenderer {
  constructor({ canvas = null, renderStyle = "wireframe" } = {}) {
    this.domElement = canvas || document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.domElement.style.display = "block";
    this.renderStyle = renderStyle;
    this.lowerBound = 0;
    this.upperBound = 100;
    this.steps = 0;
    this.strokeWidth = 0.5;
    this.sceneWidth = 0;
    this.sceneHeight = 0;
  }

  setBackgroundColor(topColor, bottomColor) {
    this.domElement.style.backgroundImage = `linear-gradient(${topColor},${bottomColor})`;
  }

  setSize(width, height) {
    this.domElement.setAttribute("width", width);
    this.sceneWidth = width;
    this.domElement.setAttribute("height", height);
    this.sceneHeight = height;
  }

  setRenderStyle(renderStyle) {
    this.renderStyle = renderStyle;
  }

  setShadingStyle(lowerBound, upperBound, steps) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.steps = steps;
  }

  setStrokeWidth(width) {
    this.strokeWidth = width;
  }

  clearScene() {
    const existing = this.domElement.querySelector("#renderContainer");
    if (existing) this.domElement.removeChild(existing);
  }

  render(scene, camera) {
    this.clearScene();

    const renderContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    renderContainer.setAttribute("id", "renderContainer");
    this.domElement.appendChild(renderContainer);

    const quads = scene.children.flatMap((child) => child.quads);

    const viewMatrix = new THREE.Matrix4().copy(camera.matrixWorld).invert();

const sorted = quads.map((quad) => {
  const cameraZ = quad.points
    .map(p => p.clone().applyMatrix4(viewMatrix).z)
    .reduce((sum, z) => sum + z, 0) / quad.points.length;

  return new Quad(quad.points, cameraZ);
    }).sort((a, b) => a.midpoint - b.midpoint); // far to near


    sorted.forEach((quad) => {
      this.drawFace(quad.points, camera, renderContainer);
    });
  }

  projectPoint(vector, camera) {
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    const matView = new THREE.Matrix4().copy(camera.matrixWorld).invert();
    vector.applyMatrix4(matView);
    vector.applyMatrix4(camera.projectionMatrix);
    vector.divideScalar(vector.w || 1);

    vector.x = (vector.x + 1) * 0.5 * this.sceneWidth;
    vector.y = (1 - vector.y) * 0.5 * this.sceneHeight;

    return vector;
  }

  createSVGPath(points, dp) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
    path.setAttribute("d", d);

    switch (this.renderStyle) {
      case "wireframe":
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "none");
        break;
      case "edges":
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "white");
        break;
      case "solid":
      case "solid lines":
        const color = `hsl(200, 10%, ${this.convertToColor(dp)}%)`;
        path.setAttribute("fill", color);
        if (this.renderStyle === "solid lines") {
          path.setAttribute("stroke", "black");
        }
        break;
    }

    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.setAttribute("stroke-width", `${this.strokeWidth}px`);

    return path;
  }

  computeNormal(points) {
    if (this.renderStyle === "wireframe") {
      return new THREE.Vector3(0, 0, 0);
    }

    const line1 = points[1].clone().sub(points[0]);
    const line2 = points[2].clone().sub(points[0]);
    return new THREE.Vector3().crossVectors(line1, line2).normalize();
  }

  drawFace(points, camera, container) {
    const normal = this.computeNormal(points);

    let viewDirection;
    if (camera.isPerspectiveCamera) {
      viewDirection = points[2].clone().sub(camera.position).normalize();
    } else if (camera.isOrthographicCamera) {
      const cameraWorldDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraWorldDirection);
      viewDirection = cameraWorldDirection.clone().normalize();
    }

    if (this.renderStyle === "wireframe" || normal.dot(viewDirection) < 0) {
      const lightDirection = new THREE.Vector3();
      camera.getWorldDirection(lightDirection);
      lightDirection.normalize();

      const dp = this.renderStyle !== "wireframe" ? Math.max(0, normal.dot(lightDirection.negate())) : 0; //negating the light is wrong, maybe invert the faces

      const projected = points.map((p) => this.projectPoint(p.clone(), camera));
      const path = this.createSVGPath(projected, dp);
      container.appendChild(path);
    }
  }

  convertToColor(value) {
    let scaledValue = this.lowerBound + (this.upperBound - this.lowerBound) * value;

    if (this.steps > 0) {
      const stepSize = (this.upperBound - this.lowerBound) / (this.steps - 1);
      for (let i = 0; i < this.steps; i++) {
        if (scaledValue <= this.lowerBound + i * stepSize) {
          scaledValue = this.lowerBound + i * stepSize;
          break;
        }
      }
    }

    return scaledValue;
  }





  
}

export { ThreeRenderer };
