import { createAction } from '../../core/util/AppUtil';

export const ModuleEvents = {
  LOADING_STARTED: 'LOADING_STARTED',
  LOADING_FINISHED: 'LOADING_FINISHED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UPDATE_CURRENT_USER_COODINATES: 'UPDATE_CURRENT_USER_COORDINATES',
  UPDATE_SELECTED_LOCATION: 'UPDATE_SELECTED_LOCATION',
};

export default {
  networkError: createAction(ModuleEvents.NETWORK_ERROR, error => error),
  loadingStarted: createAction(ModuleEvents.LOADING_STARTED, action => action),
  loadingFinished: createAction(
    ModuleEvents.LOADING_FINISHED,
    action => action,
  ),
  updateCurrentUserCoordinates: createAction(
    ModuleEvents.UPDATE_CURRENT_USER_COODINATES,
    (latitude: number, longitude: number) => ({ latitude, longitude }),
  ),
  updateSelectedLocation: createAction(
    ModuleEvents.UPDATE_SELECTED_LOCATION,
    (location: string) => location,
  ),
};
