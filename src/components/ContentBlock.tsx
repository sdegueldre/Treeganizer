import React from 'react';

export default ((props) => {
  return (
    <p>{props.content}</p>
  );
}) as React.FC<{content: any}>;
