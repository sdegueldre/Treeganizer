import React, {useState} from 'react';
import './Topic.scss';
import API, { ROOT_ID } from '../services/API';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const [topicId, setId] = useState(props.id || ROOT_ID);
  const [refresher, refreshComponent] = useState();
  const topic = API.getTopic(topicId);

  const addContent = () => {
    const content = window.prompt();
    if(content && !content.match(/^\s+$/)){
      topic.contents.push(content);
      refreshComponent(!refresher);
    }
  }

  return (
    <>
      <div className="Topic">
        <h2>{topic.name}:</h2>
        <div>
          {topic.contents.map(v => <ContentBlock content={v} key={v}/>)}
          <button onClick={addContent}>Add content</button>
        </div>
        <div className="flex-column">
          {topic.subTopics.map(id => <button key={id} onClick={() => setId(id)}>{API.getTopic(id).name}</button>)}
        </div>
      </div>
      <button onClick={() => setId(ROOT_ID)}>Back to root</button>
    </>
  )
}) as React.FC<{id?: string}>;
