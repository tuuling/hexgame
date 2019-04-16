export default interface WorldMap {
  ground: {
    [propName: string]: {type: string}
  },
  objects: {
    [propName: string]: string
  }
}