import React, { Component } from 'react';
import State from '../interfaces/State';
import { connect } from 'react-redux';

import ndarray from 'ndarray';

import './DebugGrid.css';
import classNames from 'classnames';
import { mazeSelector } from '../redux/selectors';


interface StateProps {
  maze: ndarray
}

class DebugGrid extends Component<StateProps> {


  render(): React.ReactNode {

    const maze = this.props.maze;

    const table = [];

    for (let y = 0; y < maze.shape[1]; y++) {
      const children = [];
      for (let x = 0; x < maze.shape[0]; x++) {
        const classnames = classNames('debugcell', { 'walkable': !maze.get(x, y) });
        children.push(<div className={classnames} key={x}/>);
      }
      table.push(<div className="debugrow" key={y}>{children}</div>);
    }

    return (
      <div className="DebugGrid">
        {table}
      </div>
    );
  }
}


function mapStateToProps(state: State): StateProps {
  return {
    maze: mazeSelector(state)
  };
}

export default connect(
  mapStateToProps
)(DebugGrid)
