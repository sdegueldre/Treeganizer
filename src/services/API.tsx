export class Topic {
  constructor(
    public name: string,
    public linkedTopics: number[] = [],
    public contents: string[] = []
  ){ };
};

// Database stub
const topics = [
  new Topic('Topic list', [1, 2, 3]),
  new Topic('Topic 1', [3, 2], ["this is the content of topic 1", "this is a second content item"]),
  new Topic('Topic 2'),
  new Topic('A random topic'),
];

export default ({
  getTopic: (id: number): Topic => {
    if(!topics[id])
      throw new Error(`Could not render non-existant topic with id "${id}"`);
    return topics[id];
  },
  addTopic: (name: string, parent: Topic) => {
    topics.push(new Topic(name));
    parent.linkedTopics.push(topics.length-1)
  },
  save: () => {
    const state = JSON.stringify(topics.map(t => Object.values(t)));
    const anchor = document.createElement('a');
    anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(state);
    anchor.download = 'topics.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
});

export const ROOT_ID = 0;
