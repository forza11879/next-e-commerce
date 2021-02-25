import * as actions from '../action/saga.js';

const auth = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.sagaAuthCallBegan.type) return next(action);
  next(action); // 'apiCallBegan' to show in redux dev tools
  const { email, token, onSuccess, onError } = action.payload;
  try {
    // General
    // dispatch(actions.apiCallSuccess(response.data));
    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: { email, token } });
  } catch (error) {
    // General
    // dispatch(actions.apiCallFailed(error));
    // Specific
    if (onError) dispatch({ type: onError, payload: error });
  }
};

export default auth;
