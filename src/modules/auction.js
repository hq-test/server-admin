export const RESET_ERROR = 'auction/RESET_ERROR';
export const RESET_SUCCESS = 'auction/RESET_SUCCESS';

export const CREATE_REQUESTED = 'auction/CREATE_REQUESTED';
export const CREATE_SUCCESS = 'auction/CREATE_SUCCESS';
export const CREATE_FAILED = 'auction/CREATE_FAILED';

export const DELETE_REQUESTED = 'auction/DELETE_REQUESTED';
export const DELETE_SUCCESS = 'auction/DELETE_SUCCESS';
export const DELETE_FAILED = 'auction/DELETE_FAILED';

export const READ_REQUESTED = 'auction/READ_REQUESTED';
export const READ_SUCCESS = 'auction/READ_SUCCESS';
export const READ_FAILED = 'auction/READ_FAILED';

export const START_REQUESTED = 'auction/START_REQUESTED';
export const START_SUCCESS = 'auction/START_SUCCESS';
export const START_FAILED = 'auction/START_FAILED';

export const SUBSCRIBE_REQUESTED = 'auction/SUBSCRIBE_REQUESTED';
export const SUBSCRIBE_SUCCESS = 'auction/SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILED = 'auction/SUBSCRIBE_FAILED';

export const UNSUBSCRIBE_REQUESTED = 'auction/UNSUBSCRIBE_REQUESTED';
export const UNSUBSCRIBE_SUCCESS = 'auction/UNSUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_FAILED = 'auction/UNSUBSCRIBE_FAILED';

const initialState = {
  list: [],
  isCreating: false,
  isDeleting: false,
  isReading: false,
  isStarting: false,
  error: null,
  success: null,
  isSubscribing: false,
  isUnSubscribing: false,
  isSubscribed: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_SUCCESS:
      return {
        ...state,
        success: null
      };

    case READ_REQUESTED:
      return {
        ...state,
        isReading: true,
        error: null,
        success: null
      };

    case READ_SUCCESS:
      return {
        ...state,
        list: action.data,
        isReading: !state.isReading,
        error: null,
        success: null
      };

    case READ_FAILED:
      return {
        ...state,
        isReading: !state.isReading,
        error: action.error,
        success: null
      };

    case CREATE_REQUESTED:
      return {
        ...state,
        isCreating: true,
        error: null,
        success: null
      };

    case CREATE_SUCCESS:
      return {
        ...state,
        list: [action.data, ...state.list],
        isCreating: !state.isCreating,
        error: null,
        success: 'created successfully'
      };

    case CREATE_FAILED:
      return {
        ...state,
        isCreating: !state.isCreating,
        error: action.error,
        success: null
      };

    case DELETE_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        error: null,
        success: null
      };

    case DELETE_SUCCESS:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.id),
        isDeleting: !state.isDeleting,
        error: null,
        success: 'delete successfully'
      };

    case DELETE_FAILED:
      return {
        ...state,
        isDeleting: !state.isDeleting,
        error: action.error,
        success: null
      };

    case START_REQUESTED:
      return {
        ...state,
        isStarting: true,
        error: null,
        success: null
      };

    case START_SUCCESS:
      return {
        ...state,
        isStarting: !state.isStarting,
        error: null,
        success: 'live auction successfully'
      };

    case START_FAILED:
      return {
        ...state,
        isStarting: !state.isStarting,
        error: action.error,
        success: null
      };

    case SUBSCRIBE_REQUESTED:
      return {
        ...state,
        isSubscribing: true,
        error: null,
        success: null
      };

    case SUBSCRIBE_SUCCESS:
      return {
        ...state,
        isSubscribing: false,
        isSubscribed: true
      };

    case SUBSCRIBE_FAILED:
      return {
        ...state,
        isSubscribing: false,
        isSubscribed: false
      };

    case UNSUBSCRIBE_REQUESTED:
      return {
        ...state,
        isUnSubscribing: true,
        error: null,
        success: null
      };

    case UNSUBSCRIBE_SUCCESS:
      return {
        ...state,
        isUnSubscribing: false,
        isSubscribed: false
      };

    case UNSUBSCRIBE_FAILED:
      return {
        ...state,
        isUnSubscribing: false
      };
    default:
      return state;
  }
};

export const Create = data => {
  return dispatch => {
    dispatch({
      type: CREATE_REQUESTED
    });
    console.log('create new auction with data', data);

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/create',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: CREATE_FAILED,
            error: response.error && response.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: CREATE_SUCCESS,
          data: response.data
        });
        setTimeout(() => {
          dispatch({
            type: RESET_SUCCESS
          });
        }, 3000);
      }
    );
  };
};

export const Delete = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });
    console.log('delete auction with id', id);

    window.IO.socket.request(
      {
        method: 'delete',
        url: 'http://127.0.0.1:1337/api/auction/destroy',
        data: {
          id
        },
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: DELETE_FAILED,
            error: response.error && response.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: DELETE_SUCCESS,
          id
        });
        setTimeout(() => {
          dispatch({
            type: RESET_SUCCESS
          });
        }, 3000);
      }
    );
  };
};

export const Read = () => {
  return dispatch => {
    dispatch({
      type: READ_REQUESTED
    });
    console.log('reading list of auctions');

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/auction',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
          dispatch({
            type: READ_FAILED,
            error: jwres.body
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: READ_SUCCESS,
          data: response
        });
      }
    );
  };
};

export const Start = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });
    console.log('start auction with id', id);

    window.IO.socket.request(
      {
        method: 'put',
        url: 'http://127.0.0.1:1337/api/auction/start',
        data: {
          id
        },
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: START_FAILED,
            error: response.error && response.error.message
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: START_SUCCESS,
          id
        });
        setTimeout(() => {
          dispatch({
            type: RESET_SUCCESS
          });
        }, 3000);
      }
    );
  };
};

export const Subscribe = () => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });
    console.log('subscribing to list of auctions');

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/subscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: SUBSCRIBE_FAILED
          });
          return;
        }
        dispatch({
          type: SUBSCRIBE_SUCCESS
        });
      }
    );
  };
};

export const UnSubscribe = () => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });
    console.log('subscribing to list of auctions');

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/unsubscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          console.log(response); // => e.g. 403
          dispatch({
            type: UNSUBSCRIBE_FAILED,
            error: response.error
          });
          setTimeout(() => {
            dispatch({
              type: RESET_ERROR
            });
          }, 3000);
          return;
        }
        dispatch({
          type: UNSUBSCRIBE_SUCCESS
        });
      }
    );
  };
};
