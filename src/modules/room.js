/***************************************************************************
 *                                                                          *
 * Room Module                                                              *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Actions                                                                  *
 *                                                                          *
 ***************************************************************************/
export const RESET_ERROR = 'room/RESET_ERROR';
export const RESET_SUCCESS = 'room/RESET_SUCCESS';

export const CREATE_REQUESTED = 'room/CREATE_REQUESTED';
export const CREATE_SUCCESS = 'room/CREATE_SUCCESS';
export const CREATE_FAILED = 'room/CREATE_FAILED';

export const DELETE_REQUESTED = 'room/DELETE_REQUESTED';
export const DELETE_SUCCESS = 'room/DELETE_SUCCESS';
export const DELETE_FAILED = 'room/DELETE_FAILED';

export const READ_REQUESTED = 'room/READ_REQUESTED';
export const READ_SUCCESS = 'room/READ_SUCCESS';
export const READ_FAILED = 'room/READ_FAILED';

/***************************************************************************
 *                                                                          *
 * Initial State                                                            *
 *                                                                          *
 ***************************************************************************/
const initialState = {
  list: [], // list of rooms
  isCreating: false, // is in creating process
  isDeleting: false, // is in deleting process
  isReading: false, // is in reading process and filling room list
  error: null, // error message store here
  success: null // success message store here
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
 * Create room                                                              *
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
        url: 'http://127.0.0.1:1337/room',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          dispatch({
            type: CREATE_FAILED,
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
          type: CREATE_SUCCESS,
          data: response
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
 * Delete room                                                              *
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
        url: 'http://127.0.0.1:1337/room/' + id,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          dispatch({
            type: DELETE_FAILED,
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
 * Read room list                                                           *
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
        url: 'http://127.0.0.1:1337/room',
        //data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
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
