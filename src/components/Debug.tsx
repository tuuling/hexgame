import React, { Component } from 'react';
import { connect } from 'react-redux';

import State from '../interfaces/State';
import RhombusCord from '../models/RhombusCord';
import { setNight } from '../redux/actions';

interface StateProps {
  mouseCords: { x: number, y: number },
  charLoc: { x: number, y: number },
  night: number
}

interface DispatchProps {
  setNight: typeof setNight
}

type MyProps = DispatchProps & StateProps;


class Debug extends Component<MyProps> {

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setNight(parseFloat(event.target.value));
  };

  render(): React.ReactNode {

    const { x, y } = this.props.mouseCords;
    const { isoX, isoY } = RhombusCord.pixelToIso(x, y, 2);
    const { q, r } = RhombusCord.pixelToOffset(x, y);
    const char = RhombusCord.pixelToIso(this.props.charLoc.x, this.props.charLoc.y);

    return (
      <div className="debug">
        mouse: {`${x}, ${y}`}; <br/>
        iso location: {`${isoX}, ${isoY}`}; <br/>
        iso cell {`${Math.floor(isoX)}x${Math.floor(isoY)}`}; <br/>
        offset location: {`${q}q${r}`}; <br/>
        char location: {`${char.isoX}x${char.isoY}`} <br/>
        Nighttime: <input type="number" min="0" max="1" step="0.01" value={this.props.night} onChange={this.handleChange} />
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
    charLoc: state.character.location,
    night: state.night
  }
}

export default connect(
  mapStateToProps,
  { setNight }
)(Debug)