import React, { PureComponent } from 'react';

import tree from './tree.png'

interface MyProps {
  x: number,
  y: number
}

export default class Tree extends PureComponent<MyProps> {

  render(): React.ReactNode {
    // noinspection HtmlDeprecatedTag
    return (
      <image href={tree} height={91} width={58} x={this.props.x - 30} y={this.props.y - 86}/>
    );
  }
}