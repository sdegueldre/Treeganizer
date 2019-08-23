import React, {useState, useEffect} from 'react';
import API, { ROOT_ID } from '../services/API';
import './Topic.scss';
import { RouteComponentProps } from 'react-router-dom';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const topicId = parseInt(props.match.params.topicId) || ROOT_ID;
  const [topic, setTopic] = useState(API.getTopic(topicId));
  const [searchQuery, setSearchQuery] = useState('');

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

  const contents = topic.contents.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  const linkedTopics = topic.linkedTopics
    .map(id => ({id, name: API.getTopic(id).name}))
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
    <h2 className="text-center d-block">{topic.name}</h2>
    <div className="topic container px-5 py-4 my-4 d-flex flex-column">
    <form onSubmit={(e) => {
      e.preventDefault();
      if(linkedTopics.length == 1){
        props.history.push(`/${linkedTopics[0].id}`);
        setSearchQuery('');
      }
    }}>
      <label className="px-0 col-12 col-md-6 ml-auto mb-3 d-flex flex-row align-items-center">
        Search: <input className="ml-3 flex-grow-1" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus={true}></input>
      </label>
    </form>
      {topic.id !== ROOT_ID && <>
        <hr/>
        <div className="d-flex flex-column">
          {contents.map((content, contentId) => (
              <div className="d-flex flex-row align-items-center flex-wrap" key={content}>
                <ContentBlock content={content} className="col-12 col-md-9"/>
                <button onClick={() => editContent(contentId)} className="btn btn-secondary ml-auto">Edit</button>
                <button onClick={() => removeContent(contentId)} className="btn btn-danger">Delete</button>
              </div>
            )
          )}
          <button onClick={addContent} className="btn btn-primary mx-auto">Add content</button>
        </div>
        <hr/>
        <h2 className="text-center">Related topics:</h2>
      </>}
      <div className="d-flex flex-column">
        {linkedTopics.map(t => (
          <div className="d-flex flex-row align-items-center" key={t.id}>
            <button onClick={() => props.history.push(`/${t.id}`)}>{t.name}</button>
            <button onClick={() => removeTopic(t.id)} className="btn btn-danger ml-auto">Delete</button>
          </div>)
        )}
        <button onClick={addTopic} className="btn btn-primary mx-auto">Add topic</button>
      </div>
    </div>
    </>
  )
}) as React.FC<RouteComponentProps<{topicId: string}>>;
