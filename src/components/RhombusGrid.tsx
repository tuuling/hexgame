import React, { Component } from 'react';
import './Grid.css';
import { Rhombus } from './Rhombus';
import rhombcell from '../rhombcell.png'
import { RhombusCord } from '../models/RhombusCord';
import { connect } from 'react-redux';
import { changeCords } from '../redux/actions';
import memoize from 'memoize-one';

interface GridProps {
  width: number;
  height: number;
}

interface GridState {
  selectedCord: RhombusCord | null;
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

  gridElement: React.RefObject<SVGSVGElement>;

  constructor(props: MyProps) {
    super(props);

    this.state = {
      selectedCord: null
    };

    this.gridElement = React.createRef();
  }

  //

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

  handleHover = (e: React.MouseEvent) => {
    let { top, left } = this.gridElement.current!.getBoundingClientRect();
    let xcord = e.clientX - left;
    let ycord = e.clientY - top;

    this.props.changeCords(xcord, ycord);

    let { isoX, isoY } = RhombusCord.pixelToIso(xcord, ycord);

    let result = new RhombusCord(isoX, isoY);

    if (!this.state.selectedCord || (this.state.selectedCord && this.state.selectedCord.key !== result.key)) {
      this.setState({ selectedCord: result });
    }

  };


  render(): React.ReactNode {
    let cells = this.cells(this.props.width, this.props.height);

    return (
      <svg className='Grid' onMouseMove={this.handleHover}>

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
      </svg>
    );
  }
}

export default connect<{}, DispatchProps, GridProps>(
  null,
  { changeCords }
)(RhombusGrid)



