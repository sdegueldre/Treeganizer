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
  const [seeArchived, setSeeArchived] = useState(false);

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

  function removeContent(content: {text: string, isArchived: boolean}){
    if(!content.isArchived) {
      API.archiveContent(topic.contents.indexOf(content), topic.id);
    } else {
      API.removeContent(topic.contents.indexOf(content), topic.id);
    }
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

  function removeTopic(id: number, isAlreadyArchived: boolean){
    if(!isAlreadyArchived) {
      API.archiveTopic(id);
    } else {
      API.removeTopic(id);
    }
  }

  const linkedTopics = topic.linkedTopics
    .map(id => ({id, ...API.getTopic(id)}))
    .filter(t => t.isArchived === seeArchived && t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  function editTopic(id: number) {
    const topic = linkedTopics.find(t => t.id === id);
    if(topic) {
      const newName = window.prompt("edit topic:", topic.name)
      if(newName && !newName.match(/^\s+$/) && newName !== topic.name){
        API.editTopic({...API.getTopic(topic.id), name: newName});
      }
    }
  }

  function editContent(content: {text: string, isArchived: boolean}){
    const id = topic.contents.findIndex(c => c.text === content.text);
    if(id === -1)
      throw new Error(`No such content on current topic: "${content}"`);
    const newContent = window.prompt("edit content:", content.text)
    if(newContent && !newContent.match(/^\s+$/) && newContent !== content.text){
      topic.contents[id].text = newContent;
      API.editTopic(topic);
    }
  }

  const contents = topic.contents.filter(c => c.isArchived === seeArchived && c.text.toLowerCase().includes(searchQuery.toLowerCase()));



  return (
    <>
    <h2 className="text-center d-block">{topic.name}</h2>
    <div className="topic container px-5 py-4 my-4 d-flex flex-column">
    <div className="d-flex align-items-center">
      <label className="d-flex align-items-center m-0 mr-auto">
        See archived: <input className="ml-2" type="checkbox" checked={seeArchived} onChange={() => setSeeArchived(v => !v)}></input>
      </label>
      <form className="col-12 col-md-6" onSubmit={(e) => {
        e.preventDefault();
        if(linkedTopics.length === 1){
          props.history.push(`/${linkedTopics[0].id}`);
          setSearchQuery('');
        }
      }}>
        <label className="px-0 d-flex flex-row align-items-center m-0">
          Search: <input className="ml-3 flex-grow-1" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus={true}></input>
        </label>
      </form>
    </div>
      {topic.id !== ROOT_ID && <>
        <div className="d-flex flex-column mt-5">
          {contents.map((content) => (
              <div className="d-flex flex-row align-items-center content-item" key={content.text}>
                <ContentBlock content={content.text} className="flex-grow-1 my-2 mx-3"/>
                <button onClick={() => editContent(content)} className="btn"><i className="far fa-edit"></i></button>
                <button onClick={() => removeContent(content)} className="btn"><i className="far fa-trash-alt"></i></button>
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
        <h4 className="text-center mt-5 mb-4">Related topics</h4>
      </>}
      <div className="d-flex flex-column">
        {linkedTopics.map(t => (
          <div className="d-flex flex-row align-items-center" key={t.id}>
            <button className="btn btn-light border" onClick={() => props.history.push(`/${t.id}`)}>{t.name}</button>
            <button onClick={() => editTopic(t.id)} className="btn ml-auto"><i className="far fa-edit"></i></button>
            <button onClick={() => removeTopic(t.id, t.isArchived)} className="btn"><i className="far fa-trash-alt"></i></button>
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
