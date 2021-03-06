import React, { Component } from 'react';
import { connect } from 'react-redux';
import Victor from 'victor';

import RhombusCord from '../models/RhombusCord';

import charimg from '../character.png'
import State from '../interfaces/State';

import { setCharLoc } from '../redux/actions';
import { getPathSelector, isoToMazeSelector, mazeSelector } from '../redux/selectors';
import { castRay } from '../models/RayCast';
import ndarray from 'ndarray';

interface StateProps {
  location: State['character']['location'],
  destination: State['character']['destination'],
  getPath: Function,
  maze: ndarray,
  isoToMaze: ReturnType<typeof isoToMazeSelector>
}

interface DispatchProps {
  setCharLoc: typeof setCharLoc
}

type MyProps = DispatchProps & StateProps;

interface MyState {
  // walking animation state
  animationState: number,
  // direction the char is facing
  directionState: number
}

class Character extends Component<MyProps, MyState> {

  private framerate = 60;
  private speed = 2;
  private moveInterval: number | undefined;
  private animationInterval: number | undefined;

  // keep path as private prop. Prolly would be better to keep in state or store
  private path: string[] = [];

  constructor(props: MyProps) {
    super(props);

    this.state = {
      animationState: 0,
      directionState: 0
    }
  }

  componentDidUpdate(prevProps: MyProps) {
    // Animate when destination changes
    if (this.props.destination.x !== prevProps.destination.x || this.props.destination.y !== prevProps.destination.y) {

      const start = RhombusCord.fromPixel(this.props.location.x, this.props.location.y).key;
      const dest = RhombusCord.fromPixel(this.props.destination.x, this.props.destination.y).key;

      // if we can see dest, start walking to it
      if(this.canSee(start, dest)) {
        this.path = [dest]
      } else {
        this.path = this.props.getPath(start, dest);
        // Start moving to 2nd waypoint.
        this.path.shift();
      }

      this.animateLocation();

    }
  }

  protected canSee(from: string, to: string): boolean {

    const start = { x: RhombusCord.fromKey(from).toIso(2).isoX * 100, y: RhombusCord.fromKey(from).toIso(2).isoY * 100 };
    const end = { x: RhombusCord.fromKey(to).toIso(2).isoX * 100, y: RhombusCord.fromKey(to).toIso(2).isoY * 100 };

    const sight = castRay(start, end);

    // every step needs to be visible
    return sight.every((step) => {
      //only one tile in each step needs to be visible
      return step.some((tile) => {
        const mazeLoc = this.props.isoToMaze(tile);
        return this.props.maze.get(mazeLoc[0], mazeLoc[1]) === 0
      })
    });
  }

  private animateLocation() {
    window.clearInterval(this.moveInterval);
    window.clearInterval(this.animationInterval);

    const waypoint = RhombusCord.fromKey(this.path[0]);

    const currentIso = RhombusCord.pixelToIso(waypoint.pixel.x, waypoint.pixel.y, 2);
    const prevIso = RhombusCord.pixelToIso(this.props.location.x, this.props.location.y, 2);

    const isoVector = new Victor(currentIso.isoX - prevIso.isoX, currentIso.isoY - prevIso.isoY);
    const pixelVector = new Victor(waypoint.pixel.x - this.props.location.x, waypoint.pixel.y - this.props.location.y);

    const speedVector = new Victor(pixelVector.x / isoVector.length() / this.framerate * this.speed, pixelVector.y / isoVector.length() / this.framerate * this.speed);

    let remainingVector = pixelVector.clone();

    let direction = 0;

    {
      const angle = speedVector.angleDeg();
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
      // When we have arrived at our destination
      if (remainingVector.lengthSq() <= speedVector.lengthSq() && this.path.length === 1) {
        window.clearInterval(this.moveInterval);
        window.clearInterval(this.animationInterval);
        this.path = [];
        this.props.setCharLoc(this.props.destination.x, this.props.destination.y);
        this.setState({
          animationState: 0
        })
      // When we have arrived at our waypoint
      } else if(remainingVector.lengthSq() <= speedVector.lengthSq() && this.path.length > 1) {
        window.clearInterval(this.moveInterval);
        window.clearInterval(this.animationInterval);
        // shift the waypoint from the array
        this.path.shift();
        this.props.setCharLoc(waypoint.pixel.x, waypoint.pixel.y);
        this.setState({
          directionState: direction
        });
        // start animation again to the next waypoint
        this.animateLocation();
      // Still some walking left to do
      } else {
        this.props.setCharLoc(
          Math.round(waypoint.pixel.x - remainingVector.x),
          Math.round(waypoint.pixel.y - remainingVector.y)
        );
        this.setState({
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
    // noinspection HtmlDeprecatedTag
    return (
      <>
        <defs>
          <pattern id="charimage" x={this.state.animationState} y={this.state.directionState} width="5" height="4">
            <image href={charimg} width="100" height="168"/>
          </pattern>
        </defs>

        <rect fill="url(#charimage)" width="20" height="42" x={this.props.location.x - 10}
              y={this.props.location.y - 40}/>

      </>
    );
  }
}

function mapStateToProps(state: State): StateProps {
  return {
    location: state.character.location,
    destination: state.character.destination,
    getPath: getPathSelector(state),
    maze: mazeSelector(state),
    isoToMaze: isoToMazeSelector(state),
  };
}

export default connect(
  mapStateToProps,
  { setCharLoc }
)(Character)