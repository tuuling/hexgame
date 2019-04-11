import React, { Component } from 'react';
import { connect } from 'react-redux';

import State from '../interfaces/State';
import RhombusCord from '../models/RhombusCord';

interface StateProps {
  mouseCords: { x: number, y: number }
}
class Debug extends Component<StateProps> {
  render(): React.ReactNode {

    let { x, y } = this.props.mouseCords;
    let { isoX, isoY } = RhombusCord.pixelToIso(x, y, 2);
    let { q, r } = RhombusCord.pixelToOffset(x, y);

    return (
      <div className="debug">
        mouse: {`${x}, ${y}`}; <br/>
        iso location: {`${isoX}, ${isoY}`}; <br/>
        iso cell {`${Math.round(isoX)}x${Math.round(isoY)}`}; <br/>
        offset location: {`${q}q${r}`}; <br/>

      </div>
    );
  }
}

function mapStateToProps(state: State): StateProps {
  return {
    mouseCords: {
      x: state.mouseCords.x,
      y: state.mouseCords.y
    }
  }
}

export default connect(
  mapStateToProps
)(Debug)