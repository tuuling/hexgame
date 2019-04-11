import RhombusCord from '../models/RhombusCord';
import { AnyAction, combineReducers } from 'redux';

import State from '../interfaces/State';

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

const hexgameApp = combineReducers({
  mouseCords,
  map
});

export default hexgameApp;