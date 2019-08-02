import React, {useState} from 'react';
import './Topic.scss';
import API, { ROOT_ID } from '../services/API';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const [history, setHistory] = useState([ROOT_ID]);
  const [topic, setTopic] = useState(API.getTopic(ROOT_ID));

  function addContent(){
    const content = window.prompt();
    if(content && !content.match(/^\s+$/)){
      API.addContent(content, topic.id);
      setTopic(API.getTopic(topic.id));
    }
  }

  function removeContent(contentId: number){
    API.removeContent(contentId, topic.id);
    setTopic(API.getTopic(topic.id));
  }

  function addTopic(){
    const newTopic = window.prompt();
    if(newTopic && !newTopic.match(/^\s+$/)){
      API.addTopic(newTopic, topic.id);
      setTopic(API.getTopic(topic.id));
    }
  }

  function goBack(){
    if(history.length > 1) {
      setHistory(history.slice(0,-1));
      setTopic(API.getTopic(history[history.length-2]));
    }
  }

  function goTo(id: number){
    setHistory([...history, id]);
    setTopic(API.getTopic(id));
  }

  return (
      <div className="Topic" style={{width: "840px", margin: "auto"}}>
        <h2>{topic.name}:</h2>
        <div style={{width: "100%"}}>
          {topic.contents.map((content, contentId) => (
            <div className="flex-row" key={content}>
              <ContentBlock className="grow" content={content} />
              <button onClick={() => removeContent(contentId)}>Delete</button>
            </div>
          ))}
          <button onClick={addContent}>Add content</button>
        </div>
        <hr/>
        <h2>Related topics:</h2>
        <div className="flex-column" style={{width: "100%"}}>
          {topic.linkedTopics.map(id => (
            <div className="flex-row" style={{width: "100%"}} key={id}>
              <button className="grow" onClick={() => goTo(id)}>{API.getTopic(id).name}</button>
              <button onClick={() => {API.removeTopic(id); setTopic(API.getTopic(topic.id));}}>Delete</button>
            </div>
          ))}
          <button onClick={addTopic}>Add topic</button>
        </div>

        <hr/>
        <div className="controls">
          <div>
            <button onClick={() => {goTo(ROOT_ID);}}>Back to root</button>
            <button onClick={goBack}>Go back</button>
          </div>
          <button onClick={API.save}>Save state</button>
          <button onClick={async () => {await API.import(); setTopic(API.getTopic(ROOT_ID)); setHistory([ROOT_ID]); }}>Import</button>
          <button onClick={API.export}>Export</button>
        </div>
      </div>
  )
}) as React.FC<{id?: number}>;
