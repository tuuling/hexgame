import React, { Component } from 'react';
import memoize from 'memoize-one';

import RhombusCord from '../models/RhombusCord';
import Tile from '../models/Tile';

import './GroundTile.css'
import State from '../interfaces/State';
import { connect } from 'react-redux';

interface StateProps {
  tile: State['map']['ground']['propName']
}

interface GroundTileProps {
  tileId: string
}

type MyProps = GroundTileProps & StateProps;

class GroundTile extends Component<MyProps> {
  constructor(props: MyProps) {
    super(props);
  }

  get tile(): Tile {
    return memoize((tileId) => {
      let [, x, y] = tileId.match(/(-?\d+)[x](-?\d+)/).map(function (item: string) {
        return parseInt(item)
      });

      return new Tile(new RhombusCord(x, y), this.props.tile.type);
    })(this.props.tileId);
  }

  render(): React.ReactNode {
    return (
      <image href={this.tile.tileImage}
             width={'90'}
             height={'46'}
             x={this.tile.cord.pixel.x - 45}
             y={this.tile.cord.pixel.y - 23}/>

    )
  }
}


function mapStateToProps(initialState: State, ownProps: GroundTileProps) {
  return (state: State) => {
    return { tile: state.map.ground[ownProps.tileId] };
  }
}

export default connect(
  mapStateToProps
)(GroundTile)
