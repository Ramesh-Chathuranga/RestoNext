import ModuleSet from './AppModules';
import _ from 'lodash';

// metro bundler
const reducerModule: Record<string, any> = {
  common: require(`../../module/common/Reducer`),
};

const Reducers = _(ModuleSet)
  .keyBy(module => module)
  .mapValues(module => {
    return reducerModule[module];
  })
  .mapValues(module => module.Reducer)
  .value();

export default Reducers;
