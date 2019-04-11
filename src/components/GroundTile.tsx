import React, { Component } from 'react';
import memoize from 'memoize-one';

import RhombusCord from '../models/RhombusCord';
import Tile from '../models/Tile';

import './GroundTile.css'
import State from '../interfaces/State';

interface RhombusProps {
  tileId: string,
  tile: State['map']['ground']['propName']
}

export default class GroundTile extends Component<RhombusProps> {
  constructor(props: RhombusProps) {
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