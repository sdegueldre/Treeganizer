import React, {useState} from 'react';
import './Topic.scss';
import API, { ROOT_ID } from '../services/API';
import { RouteComponentProps } from 'react-router-dom';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const topicId = parseInt(props.match.params.topicId) || ROOT_ID;
  const [topic, setTopic] = useState(API.getTopic(topicId));
  if(topic.id !== topicId)
    setTopic(API.getTopic(topicId));

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

  function removeTopic(id: number){
    API.removeTopic(id);
    setTopic(API.getTopic(topic.id));
  }

  const goBack = props.history.goBack;

  function goTo(id: number){
    props.history.push(`/${id}`);
  }

  return (
      <div className="Topic" style={{width: "840px", margin: "auto"}}>
        <h2>{topic.name}:</h2>
        {topic.id !== ROOT_ID && <>
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
        </>}
        <div className="flex-column" style={{width: "100%"}}>
          {topic.linkedTopics.map(id => (
            <div className="flex-row" style={{width: "100%"}} key={id}>
              <button className="grow" onClick={() => goTo(id)}>{API.getTopic(id).name}</button>
              <button onClick={() => removeTopic(id)}>Delete</button>
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
          <button onClick={async () => {await API.import(); goTo(ROOT_ID); }}>Import</button>
          <button onClick={API.export}>Export</button>
        </div>
      </div>
  )
}) as React.FC<RouteComponentProps<{topicId: string}>>;
