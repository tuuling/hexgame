import React, {Component} from 'react';
import charimg from '../character.png'

import Victor from 'victor';
import {RhombusCord} from '../models/RhombusCord';

interface MyProps {
  location: { x: number, y: number };
}

interface MyState {
  currentLocation: { x: number, y: number };
}


export class Character extends Component<MyProps, MyState> {

  private framerate = 60;
  private speed = 1;
  private animationInterval: number | undefined;

  constructor(props: MyProps) {
    super(props);

    this.state = {
      currentLocation: props.location
    }
  }

  componentDidUpdate(prevProps: MyProps) {
    if (this.props.location.x !== prevProps.location.x || this.props.location.y !== prevProps.location.y) {

      window.clearInterval(this.animationInterval);

      let currentIso = RhombusCord.pixelToIso(this.props.location.x, this.props.location.y, 2);
      let prevIso = RhombusCord.pixelToIso(this.state.currentLocation.x, this.state.currentLocation.y, 2);

      let isoVector = new Victor(currentIso.isoX - prevIso.isoX, currentIso.isoY - prevIso.isoY);
      let pixelVector = new Victor(this.props.location.x - this.state.currentLocation.x, this.props.location.y - this.state.currentLocation.y);

      let speedVector = new Victor(pixelVector.x / isoVector.length() / this.framerate * this.speed, pixelVector.y / isoVector.length() / this.framerate * this.speed);

      let remainingVector = pixelVector.clone();

      this.animationInterval = window.setInterval(() => {

        if(remainingVector.lengthSq() <= speedVector.lengthSq()) {
          window.clearInterval(this.animationInterval);
          this.setState({
            currentLocation: {
              x: this.props.location.x,
              y: this.props.location.y
            }
          })
        } else {
          this.setState({
            currentLocation: {
              x: Math.round(this.props.location.x - remainingVector.x),
              y: Math.round(this.props.location.y - remainingVector.y)
            }
          });

          remainingVector = remainingVector.subtract(speedVector);
        }

      }, 1000 / this.framerate);

      console.log(speedVector.toString());
    }
  }

  render(): React.ReactNode {
    return (
      <image href={charimg} width={'19'} height={'42'} x={this.state.currentLocation.x - 10}
             y={this.state.currentLocation.y - 40}/>
    );
  }
}