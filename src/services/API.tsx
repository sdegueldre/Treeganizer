export class Topic {
  constructor(
    public name: string,
    public linkedTopics: number[] = [],
    public contents: string[] = []
  ){ };
};

export type topicId = number;

// Database stub
let topics = [
  new Topic('Topic list', [1, 2, 3]),
  new Topic('Topic 1', [3, 2], ["this is the content of topic 1", "this is a second content item"]),
  new Topic('Topic 2'),
  new Topic('A random topic'),
];

export default ({
  getTopic: (id: topicId): Topic & {id: topicId} => {
    if(!topics[id])
      throw new Error(`Could not render non-existant topic with id "${id}"`);
    const copy = {...topics[id]};
    return {
      name: copy.name,
      linkedTopics: [...copy.linkedTopics],
      contents: [...copy.contents],
      id: id
    };
  },
  addTopic: (name: string, parentId: number) => {
    topics.push(new Topic(name));
    topics[parentId].linkedTopics.push(topics.length-1);
  },
  removeTopic: (id: number) => {
    topics = topics.map(t => ({...t, linkedTopics: t.linkedTopics.map(linkedId => {
      if(linkedId < id)
        return linkedId;
      if(linkedId === id)
        return null;
      return linkedId-1;
    }).filter(v => v !== null)}) as Topic);
    topics.splice(id, 1);
  },
  save: () => {
    const state = JSON.stringify(topics.map(t => Object.values(t)));
    const anchor = document.createElement('a');
    anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(state);
    anchor.download = 'topics.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  },
  addContent: (content: string, id: topicId) => {
    const topic = topics[id];
    topic.contents.push(content); 
  },
  load: () => {
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
    });
  }
});

export const ROOT_ID = 0 as topicId;
