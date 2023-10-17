class Scene {
    constructor(){
        this.children = []
    }
    add(object){
        this.children.push(object)
    }
}

export {Scene};