import React, {useState} from 'react';
import './Topic.scss';
import API, { ROOT_ID } from '../services/API';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const [topicId, setId] = useState(props.id || ROOT_ID);
  const [history, setHistory] = useState([topicId]);
  console.log('component reloaded; history:', history);
  const [refresher, refreshComponent] = useState();
  const topic = API.getTopic(topicId);

  function addContent(){
    const content = window.prompt();
    if(content && !content.match(/^\s+$/)){
      topic.contents.push(content);
      refreshComponent(!refresher);
    }
  }

  function addTopic(){
    const newTopic = window.prompt();
    if(newTopic && !newTopic.match(/^\s+$/)){
      API.addTopic(newTopic, topic);
      refreshComponent(!refresher);
    }
  }

  function goBack(){
    setHistory(history.slice(0,-1));
    setId(history[history.length-2]);
  }

  function goTo(id: number){
    setHistory([...history, id]);
    setId(id);
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
          {topic.linkedTopics.map(id => (
            <div key={id}>
              <button onClick={() => goTo(id)}>{API.getTopic(id).name}</button>
              <button onClick={() => {API.removeTopic(id); refreshComponent(!refresher)}}>Delete</button>
            </div>
          ))}
          <button onClick={addTopic}>Add topic</button>
        </div>
      </div>
      <button onClick={() => setId(ROOT_ID)}>Back to root</button>
      <button onClick={API.save}>Save state</button>
      <button onClick={async () => {await API.load(); refreshComponent(!refresher)}}>Load state</button>
      <button onClick={goBack}>Go back</button>
    </>
  )
}) as React.FC<{id?: number}>;
