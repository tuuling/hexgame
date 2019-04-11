import React, { Component, CSSProperties } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import memoize from 'memoize-one';

import State from '../interfaces/State';

import RhombusCord from '../models/RhombusCord';


interface StateProps {
  selectedCord: RhombusCord | null
}

class HoverTile extends Component<StateProps> {

  get points(): string {
    return  memoize((pixel) => {

      let { width, height } = RhombusCord.cellSize;

      return [
        `${pixel.x},${pixel.y - height / 2}`,
        `${pixel.x + width / 2},${pixel.y}`,
        `${pixel.x},${pixel.y + height / 2}`,
        `${pixel.x - width / 2},${pixel.y}`
      ].join(' ');

    })(this.props.selectedCord && this.props.selectedCord.pixel);
  }

  render(): React.ReactNode {

    if(this.props.selectedCord) {
      let style: CSSProperties = { transformOrigin: `${this.props.selectedCord.pixel.x}px ${this.props.selectedCord.pixel.y}px` };
      let classnames = classNames('GroundTile', 'hover');

      return (
        <polygon points={this.points}
                 style={style}
                 className={classnames}/>
      )
    }

  }
}

function mapStateToProps(state: State): StateProps {
  return { selectedCord: RhombusCord.fromPixel(state.mouseCords.x, state.mouseCords.y) };
}

export default connect(
  mapStateToProps
)(HoverTile)
