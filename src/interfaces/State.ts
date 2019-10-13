// Structure of the Redux state store. All coordinates in isometric x and y.
export default interface State {
  // current position of the mouse
  mouseCords: {x: number, y: number},
  // current location of the char and where it's walking to
  character: {
    location: {x: number, y: number},
    destination: {x: number, y: number}
  },
  map: {
    // all the ground tiles
    ground: {
      [propName: string]: {type: string}
    },
    // all the objects
    objects: {
      [propName: string]: string
    }
  },
  // stuff we need for rendering
  render: {
    // the order in which to render tiles
    order: string[],
    // reverse of the order prop for faster lookup
    lookup: {[propName: string]: number},
    // the order to render objects
    objectOrder: string[],
    // limits/bounds of the map
    limits: {
      x: {min: number, max: number},
      y: {min: number, max: number}
    }
  },
  night: number
}