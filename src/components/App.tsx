import React, { Component } from 'react';
import './App.css';
import RhombusGrid from './RhombusGrid';

import { connect } from 'react-redux'
import { changeCords } from '../redux/actions'
import { RhombusCord } from '../models/RhombusCord';


interface StateProps {
  mouseCords: { x: number, y: number }
}

interface DispatchProps {
  changeCords: (x: number, y: number) => void;
}

type MyProps = StateProps & DispatchProps;

class App extends Component<MyProps, {}> {

  handleAddTodo = () => {
    this.props.changeCords(3, 5);
  };

  render(): React.ReactNode {

    let { x, y } = this.props.mouseCords;
    let { isoX, isoY } = RhombusCord.pixelToIso(x, y, 2);
    let { q, r } = RhombusCord.pixelToOffset(x, y);

    return (
      <div className="App">
        <div className="debug">
          mouse: {`${x}, ${y}`}; <br/>
          iso location: {`${isoX}, ${isoY}`}; <br/>
          iso cell; <br/>
          offset location: {`${q}, ${r}`}; <br/>
          <button onClick={this.handleAddTodo}>asdf</button>

        </div>
        <RhombusGrid width={10} height={30}/>
      </div>
    );
  }
}

function mapStateToProps(state: any): StateProps {
  return {
    mouseCords: {
      x: state.mouseCords.x,
      y: state.mouseCords.y
    }
  }
}

export default connect<StateProps, DispatchProps, {}>(
  mapStateToProps,
  { changeCords }
)(App)
