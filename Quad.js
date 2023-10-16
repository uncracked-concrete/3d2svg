import { Edge } from "./Edge.js";
class Quad {
    constructor(vector1, vector2, vector3, vector4){
        this.edges = []
        this.edges.push(new Edge(vector1, vector2))
        this.edges.push(new Edge(vector2, vector3))
        this.edges.push(new Edge(vector3, vector4))
        this.edges.push(new Edge(vector4, vector1))
    }
}

export {Quad};