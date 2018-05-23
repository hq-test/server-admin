import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import List from '../../components/lists/list.js';
import { Delete, Read } from '../../modules/partner';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';

class Partner extends React.Component {
  // componentDidMount() {
  //   this.props.Read();
  // }

  render() {
    const props = this.props;
    return (
      <div>
        <h1>Partner</h1>
        <button onClick={() => props.redirectPartnerAdd()}>
          Add new partner
        </button>

        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {props.list.length ? (
          <List
            items={props.list}
            options={[
              { headerTitle: 'ID', field: 'id', renderer: 'string' },
              { headerTitle: 'Title', field: 'title', renderer: 'string' },
              {
                headerTitle: 'Username',
                field: 'username',
                renderer: 'string'
              },
              { headerTitle: 'Password', field: 'password', renderer: 'string' }
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
  list: state.partner.list,
  error: state.partner.error,
  success: state.partner.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Read,
      Delete,
      redirectPartnerAdd: () => push('/partner/add')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Partner);
