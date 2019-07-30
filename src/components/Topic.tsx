import React, {useState} from 'react';
import './Topic.scss';
import API from '../services/API';

export default ((props) => {
  let [topicId, setId] = useState(props.id || 'topic list');
  const topic = API.getTopic(topicId);

  return (
    <>
      <div className="Topic">
        <h2>{topic.name}:</h2>
        {topic.subTopics && topic.subTopics.map(id => <button key={id} onClick={() => setId(id)}>{API.getTopic(id).name}</button>)}
      </div>
      <button onClick={() => setId('topic list')}>Back to root</button>
    </>
  )
}) as React.FC<{id?: string}>;
