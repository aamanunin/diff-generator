import yaml from 'js-yaml';

const extensionsActions = {
  '.json': content => JSON.parse(content),
  '.yml': content => yaml.safeLoad(content),
};

const parsers = (content, extension) => extensionsActions[extension](content);

export default parsers;
