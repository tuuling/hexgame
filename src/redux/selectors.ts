import { createSelector } from 'reselect';
import ndarray from 'ndarray';

import State from '../interfaces/State';

import { houseParams } from '../components/map-objects/House';
import createPlanner from 'l1-path-finder';
import RhombusCord from '../models/RhombusCord';

const mapSelector = (state: State) => state.map;
const renderSelector = (state: State) => state.render;

// methods to translate between iso and maze cordinates
export const isoToMazeSelector = createSelector(
  [renderSelector],
  (render) => {
    return (key: string) => {
      let { isoX: x, isoY: y } = RhombusCord.fromKey(key).toIso();

      return [x - render.limits.x.min, y - render.limits.y.min];
    }
  });

export const mazeToIsoSelector = createSelector(
  [renderSelector],
  (render) => {
    return (x: number, y: number) => {
      return `${x + render.limits.x.min}x${y + render.limits.y.min}`;
    }
  });


// the grid used for pathfinding is kept in the "maze"
export const mazeSelector = createSelector(
  [mapSelector, renderSelector, isoToMazeSelector],
  (map, render, isoToMaze) => {

    let flatMaze = [];

    // 0 means walkable, 1 means not. Every ground by default is walkable
    for (let x = render.limits.x.min; x <= render.limits.x.max; x++) {
      for (let y = render.limits.y.min; y <= render.limits.y.max; y++) {
        if (`${x}x${y}` in map.ground) {
          flatMaze.push(0);
        } else {
          flatMaze.push(1);
        }
      }
    }

    // coordinates in the maze are always positive integers. Iso coordinates can be negative also.
    let height = Math.abs(render.limits.x.max - render.limits.x.min) + 1;
    let width = Math.abs(render.limits.y.max - render.limits.y.min) + 1;

    let maze = ndarray(flatMaze, [height, width]);

    // Objects are not walkable
    Object.keys(map.objects).forEach(item => {
      let type = map.objects[item];
      let x = isoToMaze(item)[0];
      let y = isoToMaze(item)[1];
      switch (type) {
        case 'house':
          for (let w = 0; w < houseParams.width; w++) {
            for (let h = 0; h < houseParams.height; h++) {
              maze.set(x + w, y + h, 1);
            }
          }
          break;
        default:
          maze.set(x, y, 1);
      }

    });

    return maze;

  }
);

// planner is the actual pathfinder
const plannerSelector = createSelector(
  [mazeSelector],
  (maze) => {
    return createPlanner(maze)
  }
);

// returns a method that returns the path
export const getPathSelector = createSelector(
  [isoToMazeSelector, mazeToIsoSelector, plannerSelector],
  (isoToMaze, mazeToIso, planner) => {
    // path from a -> b
    return (a: string, b: string) => {
      let start = isoToMaze(a);
      let end = isoToMaze(b);

      let path: number[] = [];
      planner.search(start[0], start[1], end[0], end[1], path);

      let smooth = path.reduce((reducer: number[][], item, index) => {
        if (!reducer[Math.floor(index / 2)])
          reducer[Math.floor(index / 2)] = [];

        reducer[Math.floor(index / 2)].push(item);
        return reducer;
      }, []);

      return smooth.map(item => {
        return mazeToIso(item[0], item[1]);
      });
    }
  }
);

