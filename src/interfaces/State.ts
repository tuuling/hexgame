export default interface State {
  mouseCords: {x: number, y: number},
  character: {
    location: {x: number, y: number},
    destination: {x: number, y: number}
  },
  map: {
    ground: {
      [propName: string]: {type: string}
    },
    objects: {
      [propName: string]: string
    }
  },
  render: {
    order: string[],
    lookup: {[propName: string]: number},
    objectOrder: string[]
  }
}