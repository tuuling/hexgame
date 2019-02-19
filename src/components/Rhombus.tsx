import React, {Component, CSSProperties} from 'react';
import './Rhombus.css'
import classNames from 'classnames'
import {RhombusCord} from '../models/RhombusCord';

interface RhombusProps {
  "pos-x": number;
  "pos-y": number;
  hover: boolean;

}

export class Rhombus extends Component<RhombusProps> {
  public static defaultProps = {
    "pos-x": 0,
    "pos-y": 0,
    hover: false
  };

  constructor(props: RhombusProps) {
    super(props);
  }


  render(): React.ReactNode {
    let {width, height} = RhombusCord.cellSize;

    let points = [
      `${this.props['pos-x']},${this.props['pos-y'] - height / 2}`,
      `${this.props['pos-x'] + width / 2},${this.props['pos-y']}`,
      `${this.props['pos-x']},${this.props['pos-y'] + height / 2}`,
      `${this.props['pos-x'] - width / 2},${this.props['pos-y']}`,
    ].join(' ');

    let style: CSSProperties = {transformOrigin: `${this.props['pos-x']}px ${this.props['pos-y']}px`};
    let classnames = classNames('Rhombus', {hover: this.props.hover});

    return (<polygon points={points}
                     style={style}
                     className={classnames}/>)
  }
}