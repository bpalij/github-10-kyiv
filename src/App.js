import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store.js';
import ReduxApp from './ReduxApp.js';
// import logo from './logo.svg';
// import './App.css';

class App extends Component {
  render() {
    return (
      /*<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>*/
      <Provider store={store}><ReduxApp/></Provider>      
    );
  }
}

export default App;
