import React, {useState} from 'react';
import './Topic.scss';
import API, { ROOT_ID } from '../services/API';

export default ((props) => {
  let [topicId, setId] = useState(props.id || ROOT_ID);
  const topic = API.getTopic(topicId);

  return (
    <>
      <div className="Topic">
        <h2>{topic.name}:</h2>
        <div>
          {topic.contents.map(c => <p key={c}>{c}</p>)}
        </div>
        <div className="flex-column">
          {topic.subTopics.map(id => <button key={id} onClick={() => setId(id)}>{API.getTopic(id).name}</button>)}
        </div>
      </div>
      <button onClick={() => setId(ROOT_ID)}>Back to root</button>
    </>
  )
}) as React.FC<{id?: string}>;
