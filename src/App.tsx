import React from 'react';
import './App.scss';
import Topic from './components/Topic';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default (() => (
  <Router>
    <Route exact path="/:topicId" component={Topic}/>
    <Route exact path="/" component={Topic}/>
  </Router>
)) as React.FC;
