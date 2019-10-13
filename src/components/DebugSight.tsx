import React, { Component, CSSProperties } from 'react';
import State from '../interfaces/State';
import { connect } from 'react-redux';

import RhombusCord from '../models/RhombusCord';

import DebugSightTile from './DebugSightTile';
import { castRay } from '../models/RayCast';


interface StateProps {
  mouseTile: string,
  charTile: string
}

class DebugSight extends Component<StateProps> {

  render(): React.ReactNode {

    const mouseTile = RhombusCord.fromKey(this.props.mouseTile);
    const charTile = RhombusCord.fromKey(this.props.charTile);


    const start = { x: charTile.toIso(2).isoX * 100, y: charTile.toIso(2).isoY * 100 };
    const end = { x: mouseTile.toIso(2).isoX * 100, y: mouseTile.toIso(2).isoY * 100 };

    const grid = castRay(start, end);

    const style: CSSProperties = { stroke: 'black', strokeWidth: 2 };

    return (
      <>
        {grid.map((item) => {
          return item.map((tile) => {
            return (<DebugSightTile key={tile} tileId={tile}/>)
          });
        })}

        <line x1={charTile.pixel.x} y1={charTile.pixel.y} x2={mouseTile.pixel.x} y2={mouseTile.pixel.y}
              style={style}/>
      </>
    );
  }

}

function mapStateToProps(state: State): StateProps {
  return {
    mouseTile: RhombusCord.fromPixel(state.mouseCords.x, state.mouseCords.y).key,
    charTile: RhombusCord.fromPixel(state.character.location.x, state.character.location.y).key
  }
}

export default connect(
  mapStateToProps
)(DebugSight)