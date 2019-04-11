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