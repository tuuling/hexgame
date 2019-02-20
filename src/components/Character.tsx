import React, {Component} from 'react';
import charimg from '../character.png'

interface MyProps {
  location: {x: number, y: number};
}

export class Character extends Component<MyProps> {
  render(): React.ReactNode {
    return (
      <image href={charimg} width={'19'} height={'42'} x={this.props.location.x - 10} y={this.props.location.y - 40}/>
    );
  }
}