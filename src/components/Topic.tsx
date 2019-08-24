import React, {useState, useEffect} from 'react';
import API, { ROOT_ID } from '../services/API';
import './Topic.scss';
import { RouteComponentProps } from 'react-router-dom';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const topicId = parseInt(props.match.params.topicId) || ROOT_ID;
  const [topic, setTopic] = useState(API.getTopic(topicId));
  const [searchQuery, setSearchQuery] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [topicInput, setTopicInput] = useState('');

  function reloadTopic() {
    setTopic(API.getTopic(topicId));
  }
  // Reload topic if topicId changes
  useEffect(reloadTopic, [topicId]);
  API.onChange(reloadTopic)

  function addContent(e: React.FormEvent<HTMLFormElement>){
    if(e !== null) {
      e.preventDefault();
      if(contentInput && !contentInput.match(/^\s+$/)){
        API.addContent(contentInput, topic.id);
        setContentInput('');
      }
    }
  }

  function removeContent(content: string){
    API.removeContent(topic.contents.indexOf(content), topic.id);
  }

  function addTopic(e: React.FormEvent<HTMLFormElement>){
    if(e !== null) {
      e.preventDefault();
      if(topicInput && !topicInput.match(/^\s+$/)){
        const newTopicId = API.addTopic(topicInput, topic.id);
        setTopicInput('');
        props.history.push(`/${newTopicId}`);
      }
    }
  }

  function removeTopic(id: number){
    API.removeTopic(id);
  }

  const linkedTopics = topic.linkedTopics
    .map(id => ({id, name: API.getTopic(id).name}))
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  function editTopic(id: number) {
    const topic = linkedTopics.find(t => t.id === id);
    if(topic) {
      const newName = window.prompt("edit topic:", topic.name)
      if(newName && !newName.match(/^\s+$/) && newName !== topic.name){
        API.editTopic({...API.getTopic(topic.id), name: newName});
      }
    }
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


  return (
    <>
    <h2 className="text-center d-block">{topic.name}</h2>
    <div className="topic container px-5 py-4 my-4 d-flex flex-column">
    <form onSubmit={(e) => {
      e.preventDefault();
      if(linkedTopics.length === 1){
        props.history.push(`/${linkedTopics[0].id}`);
        setSearchQuery('');
      }
    }}>
      <label className="px-0 col-12 col-md-6 ml-auto mb-3 d-flex flex-row align-items-center">
        Search: <input className="ml-3 flex-grow-1" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus={true}></input>
      </label>
    </form>
      {topic.id !== ROOT_ID && <>
        <div className="d-flex flex-column mt-4">
          {contents.map((content, contentId) => (
              <div className="d-flex flex-row align-items-center flex-wrap content-item" key={content}>
                <ContentBlock content={content} className="col-12 col-md-9 my-0"/>
                <button onClick={() => editContent(contentId)} className="btn btn-secondary ml-auto">Edit</button>
                <button onClick={() => removeContent(content)} className="btn btn-danger">Delete</button>
              </div>
            )
          )}
          <form className="form-inline" onSubmit={addContent}>
            <input
              className="form-control flex-grow-1"
              placeholder="Add some content..."
              type="text"
              onChange={(e) => setContentInput(e.target.value)}
              value={contentInput}
            ></input>
            <button type="submit" className="btn btn-primary ml-1">Submit</button>
          </form>
        </div>
        <h2 className="text-center mt-4">Related topics:</h2>
      </>}
      <div className="d-flex flex-column">
        {linkedTopics.map(t => (
          <div className="d-flex flex-row align-items-center" key={t.id}>
            <button className="btn btn-light border" onClick={() => props.history.push(`/${t.id}`)}>{t.name}</button>
            <button onClick={() => editTopic(t.id)} className="btn btn-secondary ml-auto">Edit</button>
            <button onClick={() => removeTopic(t.id)} className="btn btn-danger">Delete</button>
          </div>)
        )}
        <form className="form-inline" onSubmit={addTopic}>
          <input
            className="form-control flex-grow-1"
            placeholder="Add a topic..."
            type="text"
            onChange={(e) => setTopicInput(e.target.value)}
            value={topicInput}
          ></input>
          <button type="submit" className="btn btn-primary ml-1">Submit</button>
        </form>
      </div>
    </div>
    </>
  )
}) as React.FC<RouteComponentProps<{topicId: string}>>;
