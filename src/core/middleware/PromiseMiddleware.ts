// local isFSA type guard to avoid depending on external 'flux-standard-action' types
const isFSA = (
  action: any,
): action is { type: string; payload?: any; error?: boolean; meta?: any } => {
  return (
    !!action &&
    typeof action === 'object' &&
    typeof (action as any).type === 'string'
  );
};
import { Actions } from '../modules/Actions';

const isPromise = (value: any): value is Promise<any> => {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as any).then === 'function'
  );
};

const promiseMiddleware = ({ dispatch }: any) => {
  return (next: any) => (action: any) => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }

    const isLoadingAction = action.meta && action.meta.loading;
    if (isPromise(action.payload)) {
      if (isLoadingAction) {
        // Don't store the Promise in state - only store action metadata
        dispatch(
          Actions.common.loadingStarted({
            type: action.type,
            meta: action.meta,
          }),
        );
      }
      return action.payload
        .then(result => {
          dispatch({ ...action, payload: result });
          if (isLoadingAction) {
            dispatch(
              Actions.common.loadingFinished({
                type: action.type,
                meta: action.meta,
              }),
            );
          }
        })
        .catch(error => {
          dispatch({ ...action, payload: error, error: true });
          if (isLoadingAction) {
            dispatch(
              Actions.common.loadingFinished({
                type: action.type,
                meta: action.meta,
              }),
            );
          }
          return Promise.reject(error);
        });
    } else {
      return next(action);
    }
  };
};
export default promiseMiddleware;
