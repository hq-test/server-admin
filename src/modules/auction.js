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

const initialState = {
  list: [],
  isCreating: false,
  isDeleting: false,
  isReading: false,
  error: null,
  success: null
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
        url: 'http://127.0.0.1:1337/auction',
        data: data,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
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

export const Delete = id => {
  return dispatch => {
    dispatch({
      type: DELETE_REQUESTED
    });
    console.log('delete auction with id', id);

    window.IO.socket.request(
      {
        method: 'delete',
        url: 'http://127.0.0.1:1337/auction/' + id,
        headers: {}
      },
      function(response, jwres) {
        if (jwres.error) {
          console.log(jwres); // => e.g. 403
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
