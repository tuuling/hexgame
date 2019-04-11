import React, { PureComponent } from 'react';
import RhombusCord from '../../models/RhombusCord';

import hedge from './hedge.png'
import memoize from 'memoize-one';

interface MyProps {
  tileId: string
}

export default class Hedge extends PureComponent<MyProps> {

  get cord(): RhombusCord {
    return memoize((tileId) => {
      let [, x, y] = tileId.match(/(-?\d+)[x](-?\d+)/).map(function (item: string) {
        return parseInt(item)
      });

      return new RhombusCord(x, y);
    })(this.props.tileId);
  }

  render(): React.ReactNode {
    return (
      <image href={hedge} height={39} width={42} x={this.cord.pixel.x - 20} y={this.cord.pixel.y - 27}/>
    );
  }
}