import React, {PureComponent} from 'react';
import hedge from './hedge.png'

interface MyProps {
  x: number,
  y: number
}

export class Hedge extends PureComponent<MyProps> {
  render(): React.ReactNode {
    return (
      <image href={hedge} height={39} width={42} x={this.props.x - 20} y={this.props.y - 27}/>
    );
  }
}