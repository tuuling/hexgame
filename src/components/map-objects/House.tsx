import React, { PureComponent } from 'react';

import house from './house.png'

interface MyProps {
  x: number,
  y: number
}

export const houseParams = {
  height: 2,
  width: 3,
  walkable: false
};

export default class House extends PureComponent<MyProps> {

  render(): React.ReactNode {
    // noinspection HtmlDeprecatedTag
    return (
      <image href={house} height={223} width={214} x={this.props.x - 41} y={this.props.y - 182}/>
    );
  }
}