import React, { Component } from 'react';
import charimg from '../character.png'

import Victor from 'victor';
import { RhombusCord } from '../models/RhombusCord';

interface MyProps {
  location: { x: number, y: number };
}

interface MyState {
  currentLocation: { x: number, y: number };
  animationState: number;
  directionState: number;
}


export class Character extends Component<MyProps, MyState> {

  private framerate = 60;
  private speed = 2;
  private moveInterval: number | undefined;
  private animationInterval: number | undefined;

  constructor(props: MyProps) {
    super(props);

    this.state = {
      currentLocation: props.location,
      animationState: 0,
      directionState: 0
    }
  }

  componentDidUpdate(prevProps: MyProps) {
    if (this.props.location.x !== prevProps.location.x || this.props.location.y !== prevProps.location.y) {
      this.animateLocation();
    }
  }

  private animateLocation() {
    window.clearInterval(this.moveInterval);
    window.clearInterval(this.animationInterval);

    let currentIso = RhombusCord.pixelToIso(this.props.location.x, this.props.location.y, 2);
    let prevIso = RhombusCord.pixelToIso(this.state.currentLocation.x, this.state.currentLocation.y, 2);

    let isoVector = new Victor(currentIso.isoX - prevIso.isoX, currentIso.isoY - prevIso.isoY);
    let pixelVector = new Victor(this.props.location.x - this.state.currentLocation.x, this.props.location.y - this.state.currentLocation.y);

    let speedVector = new Victor(pixelVector.x / isoVector.length() / this.framerate * this.speed, pixelVector.y / isoVector.length() / this.framerate * this.speed);

    let remainingVector = pixelVector.clone();

    console.log(speedVector.angleDeg());
    let direction = 0;

    {
      let angle = speedVector.angleDeg();
      if(angle >= 0 && angle <= 90) {
        direction = 2;
      } else if(angle > 90 && angle <= 180) {
        direction = 1
      } else if(angle <= 0 && angle >= -90) {
        direction = 3
      } else if(angle < -90 && angle >= -180) {
        direction = 4
      }
    }


    this.moveInterval = window.setInterval(() => {

      if (remainingVector.lengthSq() <= speedVector.lengthSq()) {
        window.clearInterval(this.moveInterval);
        window.clearInterval(this.animationInterval);
        this.setState({
          currentLocation: {
            x: this.props.location.x,
            y: this.props.location.y
          },
          animationState: 0
        })
      } else {
        this.setState({
          currentLocation: {
            x: Math.round(this.props.location.x - remainingVector.x),
            y: Math.round(this.props.location.y - remainingVector.y)
          },
          directionState: direction
        });

        remainingVector = remainingVector.subtract(speedVector);
      }

    }, 1000 / this.framerate);

    this.setState({
      animationState: 1
    });

    this.animationInterval = window.setInterval(() => {
      let newState = 0;
      switch (this.state.animationState) {
      case 0:
      case 4:
        newState = 1;
        break;
      default:
        newState = this.state.animationState + 1;
      }

      this.setState({
        animationState: newState
      });

    }, 1000 / 10);
  }

  render(): React.ReactNode {
    return (
      <>
        <defs>
          <pattern id="charimage" x={this.state.animationState} y={this.state.directionState} width="5" height="4">
            <image href={charimg} width="100" height="168"/>
          </pattern>
        </defs>

        <rect fill="url(#charimage)" width="20" height="42" x={this.state.currentLocation.x - 10}
              y={this.state.currentLocation.y - 40}/>

      </>
    );
  }
}