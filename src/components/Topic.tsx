import React from 'react';
import API from '../services/API';

export default ((props) => {
  const topic = API.getTopic(props.id);

  return (
    <div className="Topic">
      <h2>{topic.name}:</h2>
      {topic.subTopics && topic.subTopics.map(id => <p key={id}>{API.getTopic(id).name}</p>)}
    </div>
  )
}) as React.FC<{id: string}>;
