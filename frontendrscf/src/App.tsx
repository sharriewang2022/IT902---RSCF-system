import React from 'react';
import { HashRouter as Router } from 'react-router-dom'
import RouteView from './admin/views/routerView'
import './antd/dist/antd.min.css';

function App() {
  return (
    <Router>
      <RouteView></RouteView>
    </Router>      
  );
}

export default App;

