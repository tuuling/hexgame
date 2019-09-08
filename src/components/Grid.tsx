import React, { Component } from 'react';
import { connect } from 'react-redux';

import RhombusCord from '../models/RhombusCord';

import HoverTile from './HoverTile';
import Ground from './Ground';

import { changeCords, setCharDest } from '../redux/actions';

import './Grid.css';
import State from '../interfaces/State';
import Objects from './Objects';
import DebugSight from './DebugSight';


interface StateProps {
  ground: State['map']['ground']
}

interface DispatchProps {
  changeCords: typeof changeCords,
  setCharDest: typeof setCharDest
}

type MyProps = DispatchProps & StateProps;

class Grid extends Component<MyProps> {

  constructor(props: MyProps) {
    super(props);

    this.gridElement = React.createRef();
  }

  private gridElement: React.RefObject<SVGSVGElement>;

  private locationOnMap(e: React.MouseEvent) {
    const { top, left } = this.gridElement.current ? this.gridElement.current.getBoundingClientRect() : {
      top: 0,
      left: 0
    };

    return { x: e.clientX - left, y: e.clientY - top }
  }

  handleHover = (e: React.MouseEvent) => {
    const { x: xcord, y: ycord } = this.locationOnMap(e);

    this.props.changeCords(xcord, ycord);

  };

  handleClick = (e: React.MouseEvent) => {
    const { x: xcord, y: ycord } = this.locationOnMap(e);
    const cell = RhombusCord.fromPixel(xcord, ycord);
    if (cell.key in this.props.ground) {
      this.props.setCharDest(cell.pixel.x, cell.pixel.y);

    }

  };


  render(): React.ReactNode {
    return (
      <svg className='Grid' >

        <g transform={'translate(0, 0)'} ref={this.gridElement}>
          <Ground/>
          <HoverTile/>
        </g>

        <g transform={'translate(0, 0)'}>
          <Objects/>
        </g>
        <g transform={'translate(0, 0)'}>
          <DebugSight/>
        </g>
        {/* for some unknown reason it is best to bind events to the last rendered svg element that is not re-rendered during the app.
         Otherwise some events get lost*/}
        <rect width="100%" height="100%" style={{ fill: 'rgba(255, 255, 255, 0)' }} onMouseMove={this.handleHover} onClick={this.handleClick}/>
      </svg>
    );
  }
}


function mapStateToProps(state: State): StateProps {
  return { ground: state.map.ground };
}

export default connect(
  mapStateToProps,
  { changeCords, setCharDest }
)(Grid)



