import React, { Component, CSSProperties } from 'react';
import classNames from 'classnames';
import memoize from 'memoize-one';

import RhombusCord from '../models/RhombusCord';

interface DebugSightTileProps {
  tileId: string
}

export default class DebugSightTile extends Component<DebugSightTileProps> {

  get points(): string {
    return memoize((tileId) => {

      const pixel = RhombusCord.fromKey(tileId).pixel;

      const { width, height } = RhombusCord.cellSize;

      return [
        `${pixel.x},${pixel.y - height / 2}`,
        `${pixel.x + width / 2},${pixel.y}`,
        `${pixel.x},${pixel.y + height / 2}`,
        `${pixel.x - width / 2},${pixel.y}`
      ].join(' ');

    })(this.props.tileId);
  }

  render(): React.ReactNode {

    const style: CSSProperties = { transformOrigin: `${RhombusCord.fromKey(this.props.tileId).pixel.x}px ${RhombusCord.fromKey(this.props.tileId).pixel.y}px` };
    const classnames = classNames('GroundTile', 'hover');

    return (
      <polygon points={this.points}
               style={style}
               className={classnames}/>
    )

  }
}
