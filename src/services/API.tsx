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
  save: () => console.log(JSON.stringify(topics.map(t => Object.values(t))))
});

export const ROOT_ID = 0;
