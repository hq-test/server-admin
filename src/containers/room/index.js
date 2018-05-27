import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import List from '../../components/lists/list.js';
import { Delete, Read } from '../../modules/room';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';

class Room extends React.Component {
  render() {
    const props = this.props;
    return (
      <div>
        <h1>Room</h1>
        <button onClick={() => props.redirectRoomAdd()}>Add new room</button>

        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {props.list.length ? (
          <List
            items={props.list}
            options={[
              { headerTitle: 'ID', field: 'id', renderer: 'string' },
              { headerTitle: 'Title', field: 'title', renderer: 'string' },
              {
                headerTitle: 'Main Image',
                field: 'mainImageUri',
                renderer: 'image'
              },
              { headerTitle: 'Active', field: 'isActive', renderer: 'boolean' }
            ]}
            onDelete={props.Delete}
          />
        ) : (
          <EmptyList message="List is empty, Create a new one" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  list: state.room.list,
  error: state.room.error,
  success: state.room.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Read,
      Delete,
      redirectRoomAdd: () => push('/room/add')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Room);
