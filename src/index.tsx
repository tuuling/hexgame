import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, Reducer } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './redux/reducers';

import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import State from './interfaces/State';

const store = createStore(rootReducer as Reducer<State>, devToolsEnhancer({}));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
