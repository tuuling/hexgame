import React, { Component } from 'react';
import { connect } from 'react-redux';

import WorldMap from '../interfaces/WorldMap';
import RhombusCord from '../models/RhombusCord';

import GroundTile from './GroundTile';
import Character from './Character';
import HoverTile from './HoverTile';
import Hedge from './map-objects/Hedge';

import { changeCords } from '../redux/actions';

import './Grid.css';
import State from '../interfaces/State';


interface StateProps {
  map: WorldMap
}

interface GridState {
  selectedCord: RhombusCord | null,
  charLocation: { x: number, y: number }
}

interface DispatchProps {
  changeCords: typeof changeCords
}

type MyProps = DispatchProps & StateProps;

class Grid extends Component<MyProps, GridState> {

  constructor(props: MyProps) {
    super(props);

    this.state = {
      selectedCord: null,
      charLocation: RhombusCord.offsetToPixel(0, 0)
    };

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
    if(cell.key in this.props.map.ground) {
      this.setState({ charLocation: { x: cell.pixel.x, y: cell.pixel.y }});
    }

  };


  render(): React.ReactNode {
    return (
      <svg className='Grid' onMouseMove={this.handleHover} onClick={this.handleClick}>

        <g transform={'translate(0, 0)'} ref={this.gridElement}>
          {Object.keys(this.props.map.ground).map((key) => {
            return (<GroundTile key={key}
                                tileId = {key}
                                tile = {this.props.map.ground[key]}/>)
          })}
          <HoverTile/>
        </g>

        <g transform={'translate(0, 0)'}>
          {Object.keys(this.props.map.objects).map((key) => {
            return (<Hedge key={key} tileId={key}/>)
          })}

        </g>

        <g transform={'translate(0, 0)'}>

          <Character location={this.state.charLocation}/>
        </g>
      </svg>
    );
  }
}


function mapStateToProps(state: State): StateProps {
  return { map: state.map };
}

export default connect(
  mapStateToProps,
  { changeCords }
)(Grid)



