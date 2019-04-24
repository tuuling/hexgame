import React, { Component } from 'react';
import { connect } from 'react-redux'

import Grid from './Grid';
import Debug from './Debug';
import DebugGrid from './DebugGrid';

import { loadMap } from '../redux/actions'

import './App.css';
import map from '../data/map.json';

interface DispatchProps {
  loadMap: typeof loadMap
}

class App extends Component<DispatchProps> {

  componentDidMount() {
    this.props.loadMap(map);
  }

  render(): React.ReactNode {

    return (
      <div className="App">
        <Debug />
        <Grid />
        <DebugGrid />
      </div>
    );
  }
}

export default connect(
  null,
  { loadMap }
)(App)
