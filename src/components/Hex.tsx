import {Component} from 'react';
import React from 'react';
import './Hex.css';

interface HexProps {
  radius: number;
  "pos-x": number;
  "pos-y": number;
  hover: boolean;
}

export class Hex extends Component<HexProps> {
  public static defaultProps = {
    radius: 50,
    "pos-x": 0,
    "pos-y": 0,
    hover: false
  };

  constructor(props: HexProps) {
    super(props);
  }

  render() {

    let points = [...Array(6).keys()].map((point) => {
      let angle_deg = 60 * point - 30;
      var angle_rad = Math.PI / 180 * angle_deg;
      return (this.props.radius * Math.cos(angle_rad) + this.props['pos-x']) + ',' + (this.props.radius * Math.sin(angle_rad) + this.props['pos-y']);
    }, '').join(' ');

    let style: any = {transformOrigin: `${this.props['pos-x']}px ${this.props['pos-y']}px`};
    if (this.props.hover) {
      style.fill = 'green';
    }

    return <polygon className="Hex"
                    points={points}
                    style={style}/>;
  }
}