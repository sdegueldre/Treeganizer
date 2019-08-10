import React from 'react';
import './ContentBlock.scss';

export default ((props) => {
  return (
    <p className={props.className || ""}>{props.content}</p>
  );
}) as React.FC<{content: any, className?: string}>;
