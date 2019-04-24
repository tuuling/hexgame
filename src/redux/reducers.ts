import RhombusCord from '../models/RhombusCord';
import { AnyAction, combineReducers } from 'redux';

import State from '../interfaces/State';

function destination(state = { x: 92, y: 25 }, action: AnyAction) {
  switch (action.type) {
    case 'SET_CHAR_DEST':
      return action.cords;
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
        let parseKey = key.match(/(-?\d+)[q](-?\d+)/);

        if(parseKey) {
          let [ , q, r ] = parseKey.map(function(item) {return parseInt(item)});

          let cord = RhombusCord.fromOffset(q, r);

          newMap.ground[cord.key] = action.map.ground[key];
        }

      });

      Object.keys(action.map.objects).forEach((key: string) => {
        let parseKey = key.match(/(-?\d+)[q](-?\d+)/);

        if(parseKey) {
          let [, q, r] = parseKey.map(function (item) {
            return parseInt(item)
          });

          let cord = RhombusCord.fromOffset(q, r);

          newMap.objects[cord.key] = action.map.objects[key];
        }
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
        let parseKey = item.match(/(-?\d+)[q](-?\d+)/);

        if(parseKey) {
          let [ , q, r ] = parseKey.map(function(item) {return parseInt(item)});
          return RhombusCord.fromOffset(q, r).key;
        }
        return '';
      };

      let order: string[] = Object.keys(action.map.ground);

      // sort the ground tiles in order which they need to be rendered. Top to bottom, left to right.
      // order in column row system
      order.sort((a, b) => {

        let A = a.match(/(-?\d+)[q](-?\d+)/);
        let B = b.match(/(-?\d+)[q](-?\d+)/);

        if(A && B) {
          let [, Aq, Ar] = A.map(item => parseInt(item));
          let [, Bq, Br] = A.map(item => parseInt(item));
          return (Aq - Bq) || (Ar - Br);
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
        let parseKey = item.match(/(-?\d+)[x](-?\d+)/);

        if(parseKey) {
          let [ , x, y ] = parseKey.map(function(item) {return parseInt(item)});
          limits.x.max = Math.max(limits.x.max, x);
          limits.x.min = Math.min(limits.x.min, x);
          limits.y.max = Math.max(limits.y.max, y);
          limits.y.min = Math.min(limits.y.min, y);
        }
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

const hexgameApp = combineReducers({
  mouseCords,
  character,
  map,
  render
});

export default hexgameApp;