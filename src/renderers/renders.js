import standartRender from './standartRender';
import plainRender from './plainRender';
import jsonRender from './jsonRender';

const formatActions = {
  standart: standartRender,
  plain: plainRender,
  json: jsonRender,
};

const render = (collection, format) => formatActions[format](collection);

export default render;
