import React, {Component} from 'react';
import {Hex} from './Hex';
import './Grid.css';
import {HexCord} from '../models/HexCord';
import grassimg from '../grass.png'

interface GridProps {
  width: number;
  height: number;
  "cell-radius": number;
}

interface GridState {
  selectedCord: HexCord | null;
}

export class HexGrid extends Component<GridProps, GridState> {
  public static defaultProps = {
    width: 10,
    height: 10,
    "cell-radius": 37.5
  };

  gridElement: React.RefObject<SVGSVGElement>;

  constructor(props: GridProps) {
    super(props);

    this.state = {
      selectedCord: null
    };

    this.gridElement = React.createRef();
  }

  get width(): number {
    return this.props['cell-radius'] * Math.sqrt(3);
  }

  get height(): number {
    return this.props['cell-radius'] * 2;
  }

  handleHover = (e: React.MouseEvent) => {
    let {top, left} = this.gridElement.current!.getBoundingClientRect();

    let result = this.pixelToHex(e.clientX - left - (this.width), e.clientY - top - (this.height / 2));
    if (!this.state.selectedCord || (this.state.selectedCord && this.state.selectedCord.key !== result.key)) {
      this.setState({selectedCord: result});
    }

  };

  pixelToHex(x: number, y: number) {
    let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / this.props['cell-radius'];
    let r = (2 / 3 * y) / this.props['cell-radius'];

    return (new HexCord(q, r)).round();
  }

  render(): React.ReactNode {
    let cells = new Map<string, {posX: number, posY: number, cord: HexCord}>();
    let width = this.width;
    let height = this.height;

    for (let q = 0; q < this.props.width; q++) {
      for (let r = 0; r < this.props.height; r++) {
        let offset = !(r % 2) ? (width / 2) : 0;
        let posX = (width / 2) + (q * width) + offset;
        let posY = (height / 2) + (r * height * 3 / 4);

        let cord = HexCord.fromOffset(q, r);

        cells.set(cord.key, {posX: posX, posY: posY, cord: cord});
      }
    }

    return (
      <svg className="Grid" onMouseMove={this.handleHover}>

        <g transform={'translate(10, 10)'} ref={this.gridElement}>
          {[...cells].map(([key, hex]) => {
            return (<Hex key={key}
                         pos-x={hex.posX}
                         pos-y={hex.posY}
                         radius={this.props['cell-radius']}
                         hover={!!this.state.selectedCord && this.state.selectedCord.key === key}
            />)
          })}
        </g>
        <g transform={'translate(10, 10)'}>
          {[...cells].map(([key, hex]) => {
            return (
              <image href={grassimg} width={'65'} height={'75'} x={hex.posX - 32.5 } y={hex.posY - 37.5}/>
            )
          })}
        </g>
      </svg>
    )
  }
}