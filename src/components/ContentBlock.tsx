import React from 'react';
import './ContentBlock.scss';

export default ((props) => {
  return (
    <p className={(props.className || "") + " content-block"}>{props.content}</p>
  );
}) as React.FC<{content: any, className?: string}>;
