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
  objectOrder: [] };

function render(state: State['render'] = initialRender, action: AnyAction) {
  switch (action.type) {
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

      order = order.map(offsetToKey);

      let lookup: State['render']['lookup'] = order.reduce((result: State['render']['lookup'], current, index) => {
        result[current] = index;
        return result;
      }, {});

      let objectOrder: string[] = Object.keys(action.map.objects);

      objectOrder = objectOrder.map(offsetToKey);

      objectOrder.sort((a, b) => {
        return lookup[a] - lookup[b];
      });

      return { order: order, lookup: lookup, objectOrder: objectOrder };
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