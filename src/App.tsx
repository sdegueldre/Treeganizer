import React from 'react';
import './App.scss';
import Topic from './components/Topic';
import Navbar from './components/Navbar';
import Persistence from './components/Persistence';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default (() => (
  <Router>
    <Route path="/" component={Navbar}/>    
      <Route exact path="/:topicId?" component={Topic}/>
      <Route path="/" component={Persistence}/>
  </Router>
)) as React.FC;
