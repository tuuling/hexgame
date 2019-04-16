import React, { Component } from 'react';
import State from '../interfaces/State';
import { connect } from 'react-redux';
import GroundTile from './GroundTile';

interface StateProps {
  order: State['render']['order']
}

class Ground extends Component<StateProps> {
  render(): React.ReactNode {
    return (
      <>
        {this.props.order.map((key) => {
          return (<GroundTile key={key}
                              tileId = {key} />)
        })}
      </>
    );
  }
}

function mapStateToProps(state: State): StateProps {
  return { order: state.render.order };
}

export default connect(
  mapStateToProps
)(Ground)
