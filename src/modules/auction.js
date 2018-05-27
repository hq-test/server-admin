/***************************************************************************
 *                                                                          *
 * Auction Module                                                           *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Load Libraries                                                           *
 *                                                                          *
 ***************************************************************************/
var _ = require('lodash');

/***************************************************************************
 *                                                                          *
 * Actions                                                                  *
 *                                                                          *
 ***************************************************************************/
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

export const CLIENT_UPDATE_CREATE_SUCCESS =
  'auction/CLIENT_UPDATE_CREATE_SUCCESS';
export const CLIENT_UPDATE_UPDATE_SUCCESS =
  'auction/CLIENT_UPDATE_UPDATE_SUCCESS';
export const CLIENT_UPDATE_DESTROY_SUCCESS =
  'auction/CLIENT_UPDATE_DESTROY_SUCCESS';

/***************************************************************************
 *                                                                          *
 * Initial State                                                            *
 *                                                                          *
 ***************************************************************************/
const initialState = {
  list: [], // list of auctions
  isCreating: false, // is creating a new auction
  isDeleting: false, // is deleting an auction
  isReading: false, // is in reading process and filling auction list
  isStarting: false, // is starting execute an auction
  error: null, // error message of action creators
  success: null, // success message of action creators
  isSubscribing: false, // is in subscribe process
  isUnSubscribing: false, // is in unsubscibe process
  isSubscribed: false // does it currently subscibed to auction room
};

/***************************************************************************
 *                                                                          *
 * Reducers                                                                 *
 *                                                                          *
 ***************************************************************************/
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
      console.log('new start', action.data);
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

    case CLIENT_UPDATE_CREATE_SUCCESS:
      return {
        ...state,

        // reorder the list of auctions according the duration descendant
        list: _.orderBy([action.data, ...state.list], 'endAt', 'DESC'),

        error: null,
        success: null
      };

    case CLIENT_UPDATE_UPDATE_SUCCESS:
      return {
        ...state,

        // reorder the list of auctions according the duration descendant
        list: _.orderBy(
          state.list.map(
            item => (item.id !== action.data.id ? item : action.data)
          ),
          'endAt',
          'DESC'
        ),

        error: null,
        success: null
      };

    case CLIENT_UPDATE_DESTROY_SUCCESS:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.id),
        error: null,
        success: null
      };

    default:
      return state;
  }
};

/***************************************************************************
 *                                                                          *
 * Action Creators                                                          *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Create new auction                                                       *
 *                                                                          *
 ***************************************************************************/
export const Create = data => {
  return dispatch => {
    dispatch({
      type: CREATE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/create',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
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

/***************************************************************************
 *                                                                          *
 * Remove auction                                                           *
 *                                                                          *
 ***************************************************************************/
export const Delete = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });

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

/***************************************************************************
 *                                                                          *
 * Read auction list                                                        *
 *                                                                          *
 ***************************************************************************/
export const Read = () => {
  return dispatch => {
    dispatch({
      type: READ_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'get',
        url: 'http://127.0.0.1:1337/api/auction/read/all',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: READ_FAILED,
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
          type: READ_SUCCESS,
          data: response.data
        });
      }
    );
  };
};

/***************************************************************************
 *                                                                          *
 * Start executing an auction                                               *
 *                                                                          *
 ***************************************************************************/
export const Start = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });

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

/***************************************************************************
 *                                                                          *
 * Subscribe to auction model                                               *
 *                                                                          *
 ***************************************************************************/
export const Subscribe = () => {
  return dispatch => {
    dispatch({
      type: SUBSCRIBE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/subscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
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

/***************************************************************************
 *                                                                          *
 * Unsubscribe to an auction model                                          *
 *                                                                          *
 ***************************************************************************/
export const UnSubscribe = () => {
  return dispatch => {
    dispatch({
      type: UNSUBSCRIBE_REQUESTED
    });

    window.IO.socket.request(
      {
        method: 'post',
        url: 'http://127.0.0.1:1337/api/auction/unsubscribe',
        headers: {}
      },
      function(response, jwres) {
        if (!response.result) {
          dispatch({
            type: UNSUBSCRIBE_FAILED,
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
          type: UNSUBSCRIBE_SUCCESS
        });
      }
    );
  };
};

/***************************************************************************
 *                                                                          *
 * Update auction list when a create message receive                        *
 *                                                                          *
 ***************************************************************************/
export const HandleClientCreate = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_CREATE_SUCCESS,
      data: data
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Update auction list when an update message receive                       *
 *                                                                          *
 ***************************************************************************/
export const HandleClientUpdate = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_UPDATE_SUCCESS,
      data: data
    });
  };
};

/***************************************************************************
 *                                                                          *
 * Update auction list when a remove message receive                        *
 *                                                                          *
 ***************************************************************************/
export const HandleClientDestroy = id => {
  return dispatch => {
    dispatch({
      type: CLIENT_UPDATE_DESTROY_SUCCESS,
      id: id
    });
  };
};
