import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

export default ((props) => {
  return (
    <>
    // Navbar placeholder so that the fixed navbar doesn't let the content go behind it
    <nav className="navbar navbar-expand-md">
      <button className="navbar-brand btn btn-link mr-0">←</button>
    </nav>
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <button className="navbar-brand btn btn-link mr-0" onClick={() => props.history.goBack()}>←</button>
      <button className="navbar-brand btn btn-link ml-0" onClick={() => props.history.goForward()}>→</button>
      <Link className="navbar-brand" to="/">Treeganizer</Link>
    </nav>
    </>
  )
}) as React.FC<RouteComponentProps<never>>;
