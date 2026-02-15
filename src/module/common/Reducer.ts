import { Map } from 'immutable';
// import _ from 'lodash';
import { ModuleEvents } from './Action';
import { Action } from '../../core/util/AppUtil';

const InitialState = Map({
  loadingAction: { loading: false, action: {} },
  currentCoods: { latitude: null, longitude: null },
  selectedLocation: 'Current Location',
});

export const Reducer = (
  state: Map<string, any> = InitialState,
  action: Action,
) => {
  const { payload, type } = action;
  switch (type) {
    case ModuleEvents.LOADING_STARTED: {
      return state.set('loadingAction', { loading: true, action: payload });
    }
    case ModuleEvents.LOADING_FINISHED: {
      return state.set('loadingAction', { loading: false, action: payload });
    }
    case ModuleEvents.UPDATE_CURRENT_USER_COODINATES: {
      return state.set('currentCoods', payload);
    }
    case ModuleEvents.UPDATE_SELECTED_LOCATION: {
      return state.set('selectedLocation', payload);
    }
  }
  return state;
};
