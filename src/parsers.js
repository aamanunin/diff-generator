import yaml from 'js-yaml';
import ini from 'ini';

const extensionsActions = {
  '.json': content => JSON.parse(content),
  '.yml': content => yaml.safeLoad(content),
  '.ini': content => ini.parse(content),
};

const parsers = (content, extension) => extensionsActions[extension](content);

export default parsers;
