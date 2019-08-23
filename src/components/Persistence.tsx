import React, { useEffect, useState } from 'react';
import API, { ROOT_ID } from '../services/API';
import { RouteComponentProps } from 'react-router-dom';

export default ((props) => {
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);
  const [signedIn, setSigninStatus] = useState<null|boolean>(null);

  useEffect(() => {
    API.signedIn.listen(setSigninStatus)
      .then(() => setSigninStatus(API.signedIn.get()));
  }, [])

  useEffect(() => {
    // If signedIn status changes, reload current topic from API
    if(signedIn){
      API.loadFromDrive();
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


  function save() {
    setSaveInProgress(true);
    API.save().then(() => {
      const saveIndicator = document.querySelector('.save-successful') as HTMLElement;
      if(saveIndicator){
        saveIndicator.classList.remove('flip-in-out');
        window.setTimeout(() => saveIndicator.classList.add('flip-in-out'), 1);
      }
      setSaveInProgress(false);
    });
  }

  return (
    <>
    <div className="controls d-flex flex-column align-items-center py-3 mb-5">
      <div className="d-flex flex-row">
        <button
          onClick={save}
          className="btn btn-primary"
          disabled={saveInProgress}
        >Save</button>
        <button onClick={async () => {props.history.push('/'); await API.import();}} className="btn btn-primary">Import</button>
        <button onClick={API.export} className="btn btn-primary">Export</button>
      </div>
      <div className="d-flex flex-row">
        {signedIn === null ? (
          <button className="btn btn-primary btn-disabled">Waiting for Google drive API to load...</button>
        ): signedIn ? (
          <>
            <button onClick={API.signOut} className="btn btn-primary">Sign out of Google</button>
            <button onClick={async () => {props.history.push('/'); await API.loadFromDrive();}} className="btn btn-primary">Load data from drive</button>
          </>
        ):(
          <button onClick={API.signIn} className="btn btn-primary">Sign into Google</button>
        )}
      </div>
    </div>
    {saveInProgress &&
      <div className="saving-indicator"><div></div><div></div><div></div><div></div></div>
    }
    <div className="save-successful"></div>
    </>
  )
}) as React.FC<RouteComponentProps>;
