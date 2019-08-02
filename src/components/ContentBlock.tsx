import React from 'react';
import './ContentBlock.scss';

export default ((props) => {
  return (
    <p>{props.content}</p>
  );
}) as React.FC<{content: any}>;
