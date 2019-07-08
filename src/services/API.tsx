type Topic = {
  name: string,
  subTopics?: Array<string>
};

const topics = new Map<string, Topic>([
  ['topic list', {name: 'Topic list', subTopics: ['1', '2', 'uuid']}],
  ['1', {name: 'Topic 1', subTopics: ['uuid', '2', '3']}],
  ['2', {name: 'Topic 2'}],
  ['uuid', {name: 'A random topic'}],
]);

export default ({
  getTopic: (id: string): Topic => topics.get(id) || {name: `No topic with id ${id}`}
});
