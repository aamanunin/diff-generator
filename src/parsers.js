import yaml from 'js-yaml';
import ini from 'ini';

const extensionsActions = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parse = (content, extension) => extensionsActions[extension](content);

export default parse;
