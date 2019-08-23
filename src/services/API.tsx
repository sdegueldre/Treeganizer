import DriveFiles from './DriveFiles';
const files = new DriveFiles(
  '984215183188-kqu02j37shkqubi29h8ib648ssc7r9d2.apps.googleusercontent.com',
  'AIzaSyBnHhctnONNAyM8b5lunSPCShodKkn_wM4'
)

export class Topic {
  constructor(
    public name: string,
    public linkedTopics: number[] = [],
    public contents: string[] = []
  ){ };
};

export type topicId = number;

// Database stub
let topicData = window.localStorage.getItem("topics");
let topics: Topic[];
if(topicData === null){
  topics = [
    new Topic('Topic list', [1, 2, 3]),
    new Topic('Topic 1', [3, 2], ["this is the content of topic 1", "this is a second content item"]),
    new Topic('Topic 2'),
    new Topic('A random topic'),
  ]
} else {
  topics = JSON.parse(topicData) as Topic[];
}

type Callback = () => void;

class API {

  static callbacks = {change: [] as Callback[]};

  static onChange(callback: Callback) {
    this.callbacks.change.push(callback);
  }

  static getTopic(id: topicId) {
    if(!topics[id]) {
      console.log(id);
      throw new Error(`Could not render non-existant topic with id "${id}"`);
    }
    const copy = {...topics[id]};
    return {
      name: copy.name,
      linkedTopics: [...copy.linkedTopics],
      contents: [...copy.contents],
      id: id
    };
  }

  static addTopic(name: string, parentId: number) {
    topics.push(new Topic(name));
    topics[parentId].linkedTopics.push(topics.length-1);
    this.callbacks.change.forEach(cb => cb());
    return topics.length-1;
  }

  static removeTopic(id: number) {
    topics = topics.map(t => ({...t, linkedTopics: t.linkedTopics.map(linkedId => {
      if(linkedId < id)
        return linkedId;
      if(linkedId === id)
        return null;
      return linkedId-1;
    }).filter(v => v !== null)}) as Topic);
    topics.splice(id, 1);
    this.callbacks.change.forEach(cb => cb());
  }

  static editTopic(topic: Topic & {id: number}) {
    const t = {...topic}
    const id = t.id;
    delete(t.id);
    topics[id] = t;
    this.callbacks.change.forEach(cb => cb());
  }

  static async save() {
    console.log('saving');
    window.localStorage.setItem("topics", JSON.stringify(topics));

    if(files.signedIn.get()) {
      const resp = await files.list({spaces: 'appDataFolder'});
      const topicFiles = resp.result.files.filter((f: File) => f.name === 'topics.json');
      let file;
      if(topics.length === 0) {
        // create topics file and assign it to file
      } else {
        file = topicFiles[0];
      }
      return await files.save(file.id, JSON.stringify(topics));
    }
    return true;
  }

  static export() {
    const state = JSON.stringify(topics.map(t => Object.values(t)));
    const anchor = document.createElement('a');
    anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(state);
    anchor.download = 'topics.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  static addContent(content: string, id: topicId) {
    const topic = topics[id];
    topic.contents.push(content);
    this.callbacks.change.forEach(cb => cb());
  }

  static removeContent(contentId: number, topicId: topicId) {
    const topic = topics[topicId];
    topic.contents.splice(contentId, 1);
    this.callbacks.change.forEach(cb => cb());
  }

  static import() {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.type = 'file';
    input.style.display = 'none';
    input.click();
    return new Promise((resolve, reject) => {
      input.addEventListener('change', () => {
        const files = input.files;
        if(files){
          const fr = new FileReader();
          fr.readAsText(files[0]);
          fr.onload = () => {
            try {
              topics = JSON.parse(fr.result as string).map((v: [string, number[], string[]]) => new Topic(...v));
            } catch(e) {
              console.error('Invalid JSON data, aborting.');
            }
            resolve();
          }
        } else {
          resolve();
        }
        document.body.removeChild(input);
      });
    }).then(() => this.callbacks.change.forEach(cb => cb()));
  }

  static async loadFromDrive() {
    const resp = await files.list({spaces: 'appDataFolder'});
    const topicFiles = resp.result.files.filter((f: File) => f.name === 'topics.json');
    let file;
    if(topics.length === 0) {
      // create topics file and assign it to file
    } else {
      file = topicFiles[0];
      const response = await files.get({fileId: file.id, alt: 'media'});
      console.log(response.result);
      topics = response.result;
    }
    this.callbacks.change.forEach(cb => cb());
  }

  static signedIn = files.signedIn;
  static signIn = files.signIn.bind(files);
  static signOut = files.signOut.bind(files);
}

export default API;
export const ROOT_ID = 0 as topicId;
