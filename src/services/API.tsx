export type Topic = {
  name: string,
  subTopics?: Array<string>
};

// Database stub
const topics = new Map<string, Topic>([
  ['topic list', {name: 'Topic list', subTopics: ['1', '2', 'uuid']}],
  ['1', {name: 'Topic 1', subTopics: ['uuid', '2']}],
  ['2', {name: 'Topic 2'}],
  ['uuid', {name: 'A random topic'}],
]);

export default ({
  getTopic: (id: string): Topic => {
    const topic = topics.get(id);
    if(!topic)
      throw new Error(`Could not render non-existant topic with id "${id}"`);
    return topic;
  }
});

export const ROOT_ID = 'topic list';
