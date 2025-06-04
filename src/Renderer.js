import { Vector3 } from "./Vector3D.js";
import { Quad } from "./Quad.js";
import { Matrix4 } from "./Matrix4.js";
class Renderer {
  constructor({ canvas = null, renderStyle = "solid" } = {}) {
    this.domElement = canvas;
    this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.domElement.style.display = "block";
    //svgcanvas.setAttribute("shape-rendering", "crispEdges");
    this.renderStyle = renderStyle;
    this.lowerBound = 0;
    this.upperBound = 100;
    this.steps = 0;
    this.strokeWidth = 0.5;
    this.vLookDir = new Vector3(0, 1, 0);
    this.sceneWidth = 0;
    this.sceneHeight = 0;
    this.setBackgroundColor = function (topColor, bottomColor) {
      this.domElement.style.backgroundImage = `linear-gradient(${topColor},${bottomColor})`;
    };
    this.setSize = function (width, height) {
      this.domElement.setAttribute("width", width);
      this.sceneWidth = width;
      this.domElement.setAttribute("height", height);
      this.sceneHeight = height;
    };
    this.setRenderStyle = function (renderStyle) {
      this.renderStyle = renderStyle;
    };
    this.setShadingStyle = (lowerBound, upperBound, steps) => {
        (this.lowerBound = lowerBound),
        (this.upperBound = upperBound),
        (this.steps = steps);
    };
    this.setStrokeWidth = (width) => {
      this.strokeWidth = width;
    };
    this.clearScene = () => {
      const existing = this.domElement.querySelector("#renderContainer");
      if (existing) this.domElement.removeChild(existing);
    };
    this.render = function (scene, camera, theta) {
      this.clearScene();

      const renderContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
      renderContainer.setAttribute("id", "renderContainer");
      this.domElement.appendChild(renderContainer);

      console.log(scene.children);
      const quads = scene.children.flatMap((child) => child.quads);
      console.log(quads)

      let has = [];
      quads.forEach((quad) => {
        has.push(this.RotateFaces(quad, theta));
      });

      has.sort((z1, z2) => z2.midpoint - z1.midpoint);

      has.forEach((quad) => {
        this.drawFace(quad.points, camera, renderContainer);
      });
    };
  }
  RotateFaces(face, fTheta) {

    let matRotZ = [
      Math.cos(fTheta), Math.sin(fTheta), 0, 0,
      -Math.sin(fTheta), Math.cos(fTheta),0, 0,
      0, 0, 1, 0, 
      0, 0, 0, 1
    ];
    let matRotX = [
      1, 0, 0, 0,
      0, Math.cos(fTheta * 0.5), Math.sin(fTheta * 0.5), 0,
      0, -Math.sin(fTheta * 0.5), Math.cos(fTheta * 0.5), 0,
      0, 0, 0, 1
    ];

    let rotatedPoints = [];

    face.points.forEach((vector) => {
      let vec = new Vector3();
      vec = vector;
      //vec = vec.multiplyVector3Matrix4(vector.clone(), matRotZ);
      //vec = vec.multiplyVector3Matrix4(vec.clone(), matRotX);
      //vec.z += 5.0;

      rotatedPoints.push(vec);
    });
    let midpoint = 0;

    if (rotatedPoints.length == 3) {
      midpoint =
        (rotatedPoints[0].z + rotatedPoints[1].z + rotatedPoints[2].z) / 3.0;
    } else {
      midpoint =
        (rotatedPoints[0].z + rotatedPoints[1].z + rotatedPoints[2].z + rotatedPoints[3].z) / 4.0;
    }
    return new Quad(rotatedPoints, midpoint);
  }
  projectPoint(vector, camera) {
      let vUp = new Vector3( 0, 1, 0 );
		  let vTarget = new Vector3( 0, 0, 1 );
      vTarget = camera.position.clone().add( this.vLookDir );

      const matCamera = new Matrix4().pointAt(camera.position, vTarget, vUp);

      const matView = new Matrix4().quickInverse(matCamera);

     vector.applyMatrix4(matView)


    vector.applyMatrix4(camera.projectionMatrix)
    vector.x = (vector.x + 1) * 0.5 * this.sceneWidth;
    vector.y = (vector.y + 1) * 0.5 * this.sceneHeight;
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
        if (this.renderStyle === "solid lines")
          path.setAttribute("stroke", "black");
        break;
    }

    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.setAttribute("stroke-width", `${this.strokeWidth}px`);

    return path;
  }
  computeNormal(points) {
    if (this.renderStyle === "wireframe") return new Vector3(0, 0, 0);
    const line1 = points[1].clone().subtract(points[0]); // -> Test
    const line2 = points[2].clone().subtract(points[0]);
    return new Vector3().crossVectors(line1, line2).normalize();
  }
  drawFace(points, camera, container) {
    const normal = this.computeNormal(points);

    let vCameraRay = points[2].clone().subtract(camera.position);

    if (this.renderStyle === "wireframe" || normal.dot(vCameraRay) < 0) {
      const lightDirection = new Vector3(0, 0, -1).normalize();
      const dp =
        this.renderStyle !== "wireframe" ? normal.dot(lightDirection) : 0;

      const projected = points.map((p) =>
        this.projectPoint(p, camera)
      );
      const path = this.createSVGPath(projected, dp);
      container.appendChild(path);
    }
  }
  convertToColor(value) {
    let scaledValue =
      this.lowerBound + (this.upperBound - this.lowerBound) * value;

    if (this.steps > 0) {
      let stepSize = (this.upperBound - this.lowerBound) / (this.steps - 1);
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

export { Renderer };
