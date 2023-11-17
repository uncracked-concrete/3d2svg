import { Vector3 } from "./Vector3D.js";
import { Quad } from "./Quad.js";
import { Point } from "./Point.js";

class Mesh{
    constructor(geometry){
        this.position = new Vector3(0,0,0)
        this.rotation = new Vector3(0,0,0)
        this.triangulate = function(){
          this.quads = []
          geometry.faces.forEach(face => {
            let vectors = []
            face.lines.forEach(line =>{
              let thisLine = geometry.edges.find(x => x.id == line)
              if(vectors[vectors.length - 1] != undefined && geometry.points.find(x => x.id == thisLine.endPoint).id == vectors[vectors.length - 1].id){
                  vectors.push(geometry.points.find(x => x.id == thisLine.startPoint))
              }
              else{
                  vectors.push(geometry.points.find(x => x.id == thisLine.endPoint))
              } 
            });
            let vectors1 = []
            vectors.forEach(vector => {
              let vec = new Vector3()
              vec.x = vector.position.x + this.position.x;
              vec.y = vector.position.y + this.position.y;
              vec.z = vector.position.z + this.position.z;
              vectors1.push(vec)
            })
            this.quads.push(new Quad(vectors1))
          });
        }
        this.setPosition = function(newPosition){
          this.position.x = newPosition.x
          this.position.y = newPosition.y
          this.position.z = newPosition.z
          this.triangulate();
        }
        this.setRotation = function(newRotation){
          this.rotation.x = newRotation.x
          this.rotation.y = newRotation.y
          this.rotation.z = newRotation.z
          this.triangulate();
        }
        this.quads = []
        this.triangulate()

    }
}
export {Mesh};