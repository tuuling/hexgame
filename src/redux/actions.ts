import WorldMap from '../interfaces/WorldMap';

export const changeCords = (x: number, y: number) => ({
  type: 'CHANGE_CORDS',
  mouseCords: {
    x: x,
    y: y
  }
});

export const loadMap = (map: WorldMap) => ({
  type: 'LOAD_MAP',
  map: map
});

export const setCharDest = (x: number, y: number) => ({
  type: 'SET_CHAR_DEST',
  cords: {
    x: x,
    y: y
  }
});

export const setCharLoc = (x: number, y: number) => ({
  type: 'SET_CHAR_LOC',
  cords: {
    x: x,
    y: y
  }
});