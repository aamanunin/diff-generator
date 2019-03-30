import _ from 'lodash';

const propertyActions = [
  {
    type: 'parent',
    check: (data1, data2, key) => (data1[key] instanceof Object && data2[key] instanceof Object),
    process: (value1, value2, func) => ({ children: func(value1, value2) }),
  },
  {
    type: 'notChanged',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
        && (data1[key] === data2[key])),
    process: value1 => ({ value: value1 }),
  },
  {
    type: 'changed',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
        && (data1[key] !== data2[key])),
    process: (value1, value2) => ({ valueBefore: value1, valueAfter: value2 }),
  },
  {
    type: 'deleted',
    check: (data1, data2, key) => (_.has(data1, key) && !_.has(data2, key)),
    process: value1 => ({ value: value1 }),
  },
  {
    type: 'added',
    check: (data1, data2, key) => (!_.has(data1, key) && _.has(data2, key)),
    process: (value1, value2) => ({ value: value2 }),
  },
];

const getPropertyAction = (data1, data2, key) => propertyActions
  .find(({ check }) => check(data1, data2, key));

const buildAst = (data1 = {}, data2 = {}) => {
  const dataKeys = _.union(Object.keys(data1), Object.keys(data2));

  return dataKeys.map((key) => {
    const { type, process } = getPropertyAction(data1, data2, key);
    const value = process(data1[key], data2[key], buildAst);

    return { key, type, ...value };
  });
};

export default buildAst;
