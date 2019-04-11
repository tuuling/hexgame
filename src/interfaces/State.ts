export default interface State {
  mouseCords: {x: number, y: number},
  map: {
    ground: {
      [propName: string]: {type: string}
    },
    objects: {
      [propName: string]: string[]
    }
  }
}