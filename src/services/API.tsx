export class Topic {
  constructor(
    public name: string,
    public subTopics?: string[]
  ){ };
};

// Database stub
const topics = new Map<string, Topic>([
  ['root', new Topic('Topic list', ['1', '2', 'uuid'])],
  ['1', new Topic('Topic 1', ['uuid', '2'])],
  ['2', new Topic('Topic 2')],
  ['uuid', new Topic('A random topic')],
]);

export default ({
  getTopic: (id: string): Topic => {
    const topic = topics.get(id);
    console.log(Array.from(topics));
    if(!topic)
      throw new Error(`Could not render non-existant topic with id "${id}"`);
    return topic;
  }
});

export const ROOT_ID = 'root';
