import { AnyAction, combineReducers } from 'redux';
import reduceReducer from 'reduce-reducers';

import RhombusCord from '../models/RhombusCord';
import State from '../interfaces/State';

import { isoToMazeSelector, mazeSelector } from './selectors';

function destination(state = { x: 92, y: 25 }, action: AnyAction) {
  switch (action.type) {
    // case 'SET_CHAR_DEST':
    //   return action.cords;
    default:
      return state
  }
}

function location(state = { x: 92, y: 25 }, action: AnyAction) {
  switch (action.type) {
    case 'SET_CHAR_LOC':
      return action.cords;
    default:
      return state
  }
}

const character = combineReducers({
  destination,
  location
});

function mouseCords(state = { x: 1, y: 1 }, action: AnyAction) {
  switch (action.type) {
    case 'CHANGE_CORDS':
      return action.mouseCords;
    default:
      return state
  }
}

function map(state = { ground: {}, objects: {}}, action: AnyAction) {
  switch (action.type) {
    case 'LOAD_MAP': {
      let newMap: State['map'] = { ground: {}, objects: {}};

      // map is saved as column and rows, but x and y store
      Object.keys(action.map.ground).forEach((key: string) => {

        let cord = RhombusCord.fromOffsetKey(key);

        newMap.ground[cord.key] = action.map.ground[key];

      });

      Object.keys(action.map.objects).forEach((key: string) => {
        let cord = RhombusCord.fromOffsetKey(key);

        newMap.objects[cord.key] = action.map.objects[key];
      });

      return newMap;
    }
    default:
      return state
  }
}

const initialRender = {
  order: [],
  lookup: {},
  objectOrder: [],
  limits: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 }}
};

function render(state: State['render'] = initialRender, action: AnyAction) {
  switch (action.type) {
    // When the map is loaded, calculate data used for rendering and save in store
    // Could use reselect to memoize this, but easier to debug if kept in redux store
    case 'LOAD_MAP': {

      const offsetToKey = (item: string) => {
        return RhombusCord.fromOffsetKey(item).key;
      };

      let order: string[] = Object.keys(action.map.ground);

      // sort the ground tiles in order which they need to be rendered. Top to bottom, left to right.
      // order in column row system
      order.sort((a, b) => {

        let A = RhombusCord.fromOffsetKey(a);
        let B = RhombusCord.fromOffsetKey(b);

        if (A && B) {
          let { q: Aq, r: Ar } = A.offset;
          let { q: Bq, r: Br } = B.offset;
          return (Ar - Br) || (Aq - Bq);
        } else {
          return 0;
        }

      });

      // once ordered convert to iso
      order = order.map(offsetToKey);


      // generate lookup for reverse lookup - key => render order
      let lookup: State['render']['lookup'] = order.reduce((result: State['render']['lookup'], current, index) => {
        result[current] = index;
        return result;
      }, {});

      let limits = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 }};

      // find the limits of the map
      order.forEach((item) => {
        let { isoX: x, isoY: y } = RhombusCord.fromKey(item).toIso();

        limits.x.max = Math.max(limits.x.max, x);
        limits.x.min = Math.min(limits.x.min, x);
        limits.y.max = Math.max(limits.y.max, y);
        limits.y.min = Math.min(limits.y.min, y);
      });

      // Find out the order in which the objects need to rendered using.
      let objectOrder: string[] = Object.keys(action.map.objects);

      objectOrder = objectOrder.map(offsetToKey);

      objectOrder.sort((a, b) => {
        return lookup[a] - lookup[b];
      });

      return { order: order, lookup: lookup, objectOrder: objectOrder, limits: limits };
    }
    default:
      return state
  }
}

const combinedReducers = combineReducers<State>({
  mouseCords,
  character,
  map,
  render
});

const charDestReducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case 'SET_CHAR_DEST': {

      let maze = mazeSelector(state);
      let isoToMaze = isoToMazeSelector(state);

      let mazeLoc = isoToMaze(RhombusCord.fromPixel(action.cords.x, action.cords.y).key);
      // Only set new destination for char if the location is walkable
      if(maze.get(mazeLoc[0], mazeLoc[1]) === 0) {
        return {
          ...state,
          character : {
            ...state.character,
            destination: action.cords
          }
        }
      }

      return state;
    }
    default:
      return state;
  }
};

const hexgameApp = reduceReducer<State>(combinedReducers, charDestReducer);

export default hexgameApp;
