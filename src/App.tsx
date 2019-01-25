import React, {Component} from 'react';
import './App.css';
import {Grid} from './Grid';


class App extends Component {
  render(): React.ReactNode {
    return (
      <div className="App">
        <header className="App-header">
          <Grid width={15} height={10} cell-radius={40}/>

        </header>
      </div>
    );
  }
}

export default App;
