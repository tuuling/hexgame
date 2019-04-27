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
    let { top, left } = this.gridElement.current ? this.gridElement.current.getBoundingClientRect() : { top: 0, left: 0 };

    return { x: e.clientX - left, y: e.clientY - top }
  }

  handleHover = (e: React.MouseEvent) => {
    let { x: xcord, y: ycord } = this.locationOnMap(e);

    this.props.changeCords(xcord, ycord);

  };

  handleClick = (e: React.MouseEvent) => {
    let { x: xcord, y: ycord } = this.locationOnMap(e);

    let cell = RhombusCord.fromPixel(xcord, ycord);
    if(cell.key in this.props.ground) {
      this.props.setCharDest(cell.pixel.x, cell.pixel.y);
    }

  };


  render(): React.ReactNode {
    return (
      <svg className='Grid' onMouseMove={this.handleHover} onClick={this.handleClick}>

        <g transform={'translate(0, 0)'} ref={this.gridElement}>
          <Ground/>
          <HoverTile/>
        </g>

        <g transform={'translate(0, 0)'}>
          <Objects/>
        </g>
        <DebugSight />
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



