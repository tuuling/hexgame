import React, { PureComponent } from 'react';

import house from './house.png'

interface MyProps {
  x: number,
  y: number
}

export default class House extends PureComponent<MyProps> {

  render(): React.ReactNode {
    return (
      <image href={house} height={223} width={214} x={this.props.x - 39} y={this.props.y - 181}/>
    );
  }
}