import React from 'react';
import './App.scss';
import Topic from './components/Topic';
import Navbar from './components/Navbar';
import Persistence from './components/Persistence';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default (() => (
  <Router>
    <Route path="/" component={Navbar}/>
    <div className="topic container p-5 my-4 d-flex flex-column">
      <Route exact path="/:topicId?" component={Topic}/>
      <hr/>
      <Route path="/" component={Persistence}/>
    </div>
  </Router>
)) as React.FC;
