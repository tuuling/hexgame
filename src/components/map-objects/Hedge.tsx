import React, { PureComponent } from 'react';

import hedge from './hedge.png'

interface MyProps {
  x: number,
  y: number
}

export default class Hedge extends PureComponent<MyProps> {

  render(): React.ReactNode {
    // noinspection HtmlDeprecatedTag
    return (
      <image href={hedge} height={39} width={42} x={this.props.x - 22} y={this.props.y - 28}/>
    );
  }
}