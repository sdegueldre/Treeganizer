import React, {useState, useEffect} from 'react';
import API, { ROOT_ID } from '../services/API';
import './Topic.scss';
import { RouteComponentProps } from 'react-router-dom';
import ContentBlock from './ContentBlock';

export default ((props) => {
  const topicId = parseInt(props.match.params.topicId) || ROOT_ID;
  const [topic, setTopic] = useState(API.getTopic(topicId));
  const [signedIn, setSigninStatus] = useState<null|boolean>(null);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  useEffect(() => {
    API.signedIn.listen(setSigninStatus)
      .then(() => setSigninStatus(API.signedIn.get()));
  }, [])

  useEffect(() => {
    // If signedIn status changes, reload current topc from API
    if(signedIn){
      API.loadFromDrive().then(() => setTopic(topic => API.getTopic(topic.id)));
    }
  }, [signedIn])

  useEffect(() => {
    function shortcutHandler(e: KeyboardEvent ) {
      if(e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        if(!saveInProgress) {
          save();
        }
      }
    }

    window.addEventListener('keydown', shortcutHandler);
    return () => window.removeEventListener('keydown', shortcutHandler);
  }, [saveInProgress])

  // Load topic if topicId changes
  useEffect(() => setTopic(API.getTopic(topicId)), [topicId]);

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

  function save() {
    setSaveInProgress(true);
    API.save().then(() => setSaveInProgress(false));
  }

  return (
      <div className="topic container p-5 my-4 border">
        <h2 className="text-center">{topic.name}:</h2>
        {topic.id !== ROOT_ID && <>
          <div className="d-flex flex-column">
            {topic.contents.map((content, contentId) => (
              <div className="d-flex flex-row align-items-center flex-wrap" key={content}>
                <ContentBlock content={content} className="col-12 col-md-9"/>
                <button onClick={() => removeContent(contentId)} className="btn btn-danger ml-auto">Delete</button>
              </div>
            ))}
            <button onClick={addContent} className="btn btn-primary mx-auto">Add content</button>
          </div>
          <hr/>
          <h2 className="text-center">Related topics:</h2>
        </>}
        <div className="d-flex flex-column">
          {topic.linkedTopics.map(id => (
            <div className="d-flex flex-row align-items-center" key={id}>
              <button onClick={() => goTo(id)}>{API.getTopic(id).name}</button>
              <button onClick={() => removeTopic(id)} className="btn btn-danger ml-auto">Delete</button>
            </div>
          ))}
          <button onClick={addTopic} className="btn btn-primary mx-auto">Add topic</button>
        </div>

        <hr/>
        <div className="controls d-flex flex-column align-items-center">
          <div className="d-flex flex-row">
            <button onClick={() => props.history.push('/')} className="btn btn-primary">Back to root</button>
            <button onClick={goBack} className="btn btn-primary">Go back</button>
          </div>
          <div className="d-flex flex-row">
            <button
              onClick={save}
              className="btn btn-primary"
              disabled={saveInProgress}
            >Save</button>
            <button onClick={async () => {await API.import(); goTo(ROOT_ID);}} className="btn btn-primary">Import</button>
            <button onClick={API.export} className="btn btn-primary">Export</button>
          </div>
          <div className="d-flex flex-row">
            {signedIn === null ? (
              <button className="btn btn-primary btn-disabled">Waiting for Google drive API to load...</button>
            ): signedIn ? (
              <>
                <button onClick={API.signOut} className="btn btn-primary">Sign out of Google</button>
                <button onClick={async () => {goTo(ROOT_ID); await API.loadFromDrive();}} className="btn btn-primary">Load data from drive</button>
              </>
            ):(
              <button onClick={API.signIn} className="btn btn-primary">Sign into Google</button>
            )}
          </div>
        </div>
      </div>
  )
}) as React.FC<RouteComponentProps<{topicId: string}>>;
