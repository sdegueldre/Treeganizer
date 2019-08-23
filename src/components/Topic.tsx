import React, {useState, useEffect} from 'react';
import API, { ROOT_ID } from '../services/API';
import './Topic.scss';
import { RouteComponentProps } from 'react-router-dom';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const topicId = parseInt(props.match.params.topicId) || ROOT_ID;
  const [topic, setTopic] = useState(API.getTopic(topicId));
  const [searchContent, setSearchContent] = useState('');

  function reloadTopic() {
    setTopic(API.getTopic(topicId));
  }
  // Reload topic if topicId changes
  useEffect(reloadTopic, [topicId]);
  API.onChange(reloadTopic)

  function addContent(){
    const content = window.prompt();
    if(content && !content.match(/^\s+$/)){
      API.addContent(content, topic.id);
    }
  }

  function removeContent(contentId: number){
    API.removeContent(contentId, topic.id);
  }

  function addTopic(){
    const newTopic = window.prompt();
    if(newTopic && !newTopic.match(/^\s+$/)){
      API.addTopic(newTopic, topic.id);
    }
  }

  function removeTopic(id: number){
    API.removeTopic(id);
  }

  function editContent(id: number){
    const content = topic.contents[id]
    const newContent = window.prompt("edit content:", content)
    if(newContent && !newContent.match(/^\s+$/) && newContent !== content){
      topic.contents[id] = newContent;
      API.editTopic(topic);
    }
  }

  return (
    <>
      <div className="header d-flex justify-content-between mb-4">
        <h2 className="text-center d-block">{topic.name}:</h2>
        <input className="col-6" type="text" value={searchContent} onChange={(e) => setSearchContent(e.target.value)}></input>
      </div>
      {topic.id !== ROOT_ID && <>
        <div className="d-flex flex-column">
          {topic.contents
            .filter(c => c.toLowerCase()
            .includes(searchContent.toLowerCase()))
            .map((content, contentId) => (
                <div className="d-flex flex-row align-items-center flex-wrap" key={content}>
                  <ContentBlock content={content} className="col-12 col-md-9"/>
                  <button onClick={() => editContent(contentId)} className="btn btn-secondary ml-auto">Edit</button>
                  <button onClick={() => removeContent(contentId)} className="btn btn-danger">Delete</button>
                </div>
              )
            )
          }
          <button onClick={addContent} className="btn btn-primary mx-auto">Add content</button>
        </div>
        <hr/>
        <h2 className="text-center">Related topics:</h2>
      </>}
      <div className="d-flex flex-column">
        {topic.linkedTopics.map(id => (
          <div className="d-flex flex-row align-items-center" key={id}>
            <button onClick={() => props.history.push(`/${id}`)}>{API.getTopic(id).name}</button>
            <button onClick={() => removeTopic(id)} className="btn btn-danger ml-auto">Delete</button>
          </div>
        ))}
        <button onClick={addTopic} className="btn btn-primary mx-auto">Add topic</button>
      </div>
    </>
  )
}) as React.FC<RouteComponentProps<{topicId: string}>>;
