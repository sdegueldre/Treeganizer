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

  const addTopic = () => {
    const newTopic = window.prompt();
    if(newTopic && !newTopic.match(/^\s+$/)){
      API.addTopic(newTopic, topic);
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
          {topic.linkedTopics.map(id => <button key={id} onClick={() => setId(id)}>{API.getTopic(id).name}</button>)}
          <button onClick={addTopic}>Add topic</button>
        </div>
      </div>
      <button onClick={() => setId(ROOT_ID)}>Back to root</button>
      <button onClick={API.save}>Save state</button>
    </>
  )
}) as React.FC<{id?: number}>;
