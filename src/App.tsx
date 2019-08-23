import React from 'react';
import './App.scss';
import Topic from './components/Topic';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default (() => (
  <Router>
    <Route path="/" component={Navbar}/>
    <Route exact path="/:topicId?" component={Topic}/>
  </Router>
)) as React.FC;
