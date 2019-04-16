import React, { Component } from 'react';
import { connect } from 'react-redux';

import State from '../interfaces/State';
import RhombusCord from '../models/RhombusCord';

interface StateProps {
  mouseCords: { x: number, y: number },
  charLoc: { x: number, y: number }
}
class Debug extends Component<StateProps> {
  render(): React.ReactNode {

    let { x, y } = this.props.mouseCords;
    let { isoX, isoY } = RhombusCord.pixelToIso(x, y, 2);
    let { q, r } = RhombusCord.pixelToOffset(x, y);
    let char = RhombusCord.pixelToIso(this.props.charLoc.x, this.props.charLoc.y);

    return (
      <div className="debug">
        mouse: {`${x}, ${y}`}; <br/>
        iso location: {`${isoX}, ${isoY}`}; <br/>
        iso cell {`${Math.floor(isoX)}x${Math.floor(isoY)}`}; <br/>
        offset location: {`${q}q${r}`}; <br/>
        char location: {`${char.isoX}x${char.isoY}`}
      </div>
    );
  }
}

function mapStateToProps(state: State): StateProps {
  return {
    mouseCords: {
      x: state.mouseCords.x,
      y: state.mouseCords.y
    },
    charLoc: state.character.location
  }
}

export default connect(
  mapStateToProps
)(Debug)