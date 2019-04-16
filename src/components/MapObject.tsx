import React, { PureComponent } from 'react';
import RhombusCord from '../models/RhombusCord';

import memoize from 'memoize-one';
import State from '../interfaces/State';
import { connect } from 'react-redux';
import Hedge from './map-objects/Hedge';
import House from './map-objects/House';

interface StateProps {
  object: State['map']['objects']['propName']
}

interface MapObjectProps {
  tileId: string
}

type MyProps = MapObjectProps & StateProps;

class MapObject extends PureComponent<MyProps> {

  get cord(): RhombusCord {
    return memoize((tileId) => {
      let [, x, y] = tileId.match(/(-?\d+)[x](-?\d+)/).map(function (item: string) {
        return parseInt(item)
      });

      return new RhombusCord(x, y);
    })(this.props.tileId);
  }

  render(): React.ReactNode {
    switch (this.props.object) {
      case 'house':
        return <House x={this.cord.pixel.x} y={this.cord.pixel.y}/>;
      case 'hedge':
        return <Hedge  x={this.cord.pixel.x} y={this.cord.pixel.y}/>;
    }
  }
}

function mapStateToProps(initialState: State, ownProps: MapObjectProps) {
  return (state: State) => {
    return { object: state.map.objects[ownProps.tileId] };
  }
}

export default connect(
  mapStateToProps
)(MapObject)