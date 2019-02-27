import React, { Component } from 'react';
import './Grid.css';
import { Rhombus } from './Rhombus';
import { Character } from './Character';
import { RhombusCord } from '../models/RhombusCord';
import { connect } from 'react-redux';
import { changeCords } from '../redux/actions';
import memoize from 'memoize-one';

import rhombcell from '../rhombcell.png';
import {Hedge} from './obstacles/Hedge';


interface GridProps {
  width: number;
  height: number;
}

interface GridState {
  selectedCord: RhombusCord | null;
  charLocation: { x: number, y: number };
}

interface DispatchProps {
  changeCords: (x: number, y: number) => void;
}

type MyProps = DispatchProps & GridProps;

class RhombusGrid extends Component<MyProps, GridState> {
  public static defaultProps = {
    width: 1,
    height: 1
  };

  constructor(props: MyProps) {
    super(props);

    this.state = {
      selectedCord: null,
      charLocation: RhombusCord.offsetToPixel(0, 0)
    };

    this.gridElement = React.createRef();
  }

  gridElement: React.RefObject<SVGSVGElement>;

  get currentCells() {
    return this.cells(this.props.width, this.props.height);
  }

  cells = memoize(
    (width, height) => {
      let cells = new Map<string, RhombusCord>();
      for (let q = 0; q < width; q++) {
        for (let r = 0; r < height; r++) {

          let cord = RhombusCord.fromOffset(q, r);

          cells.set(cord.key, cord);
        }
      }
      return cells;
    }
  );

  locationOnMap(e: React.MouseEvent) {
    let { top, left } = this.gridElement.current!.getBoundingClientRect();

    return { x: e.clientX - left, y: e.clientY - top }
  }

  handleHover = (e: React.MouseEvent) => {
    let { x: xcord, y: ycord } = this.locationOnMap(e);

    this.props.changeCords(xcord, ycord);

    let { isoX, isoY } = RhombusCord.pixelToIso(xcord, ycord);

    let result = new RhombusCord(isoX, isoY);

    if (!this.state.selectedCord || (this.state.selectedCord && this.state.selectedCord.key !== result.key)) {
      this.setState({ selectedCord: result });
    }

  };

  handleClick = (e: React.MouseEvent) => {
    let { x: xcord, y: ycord } = this.locationOnMap(e);

    let cell = RhombusCord.fromPixel(xcord, ycord);
    if(this.currentCells.has(cell.key)) {
      this.setState({ charLocation: { x: cell.pixel.x, y: cell.pixel.y }});
    }

  };


  render(): React.ReactNode {
    let cells = this.cells(this.props.width, this.props.height);
    const cell0 = cells.get('0x1');

    return (
      <svg className='Grid' onMouseMove={this.handleHover} onClick={this.handleClick}>

        <g transform={'translate(0, 0)'}>
          {[...cells].map(([key, cord]) => {
            return (
              <image key={key} href={rhombcell} width={'90'} height={'46'} x={cord.pixel.x - 45} y={cord.pixel.y - 23}/>
            )
          })}
        </g>

        <g transform={'translate(0, 0)'} ref={this.gridElement}>
          {[...cells].map(([key, cord]) => {
            return (<Rhombus key={key}
                             pos-x={cord.pixel.x}
                             pos-y={cord.pixel.y}
                             hover={!!this.state.selectedCord && this.state.selectedCord.key === key}/>)
          })}
        </g>
        <g transform={'translate(0, 0)'}>

          {cell0 &&
            <Hedge x={cell0.pixel.x} y={cell0.pixel.y}/>
          }
          <Character location={this.state.charLocation}/>
        </g>
      </svg>
    );
  }
}

export default connect<{}, DispatchProps, GridProps>(
  null,
  { changeCords }
)(RhombusGrid)



