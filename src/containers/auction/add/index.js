import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ErrorBox from '../../../components/messageBoxs/error.js';
import SuccessBox from '../../../components/messageBoxs/success.js';
import {
  Subscribe as SubscribeAuction,
  UnSubscribe as UnSubscribeAuction,
  HandleClientCreate as HandleClientCreateAuction
} from '../../../modules/auction';
import AuctionAddForm from '../../../components/forms/auctionAdd.js';

class AuctionAdd extends React.Component {
  componentDidMount() {
    this.props.SubscribeAuction();
    const that = this;
    window.IO.socket.on('auction_model_create', function(data) {
      console.log('>>receive auction model create message', data);
      that.props.HandleClientCreateAuction(data);
    });
  }

  componentWillUnmount() {
    this.props.UnSubscribeAuction();
  }

  render() {
    const props = this.props;

    return (
      <div>
        <h1>Auction / Add</h1>
        <p>
          <button onClick={() => props.redirectAuction()}>Back</button>
        </p>
        <p>Add new auction</p>
        <AuctionAddForm />
        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.auction.error,
  success: state.auction.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      SubscribeAuction,
      UnSubscribeAuction,
      HandleClientCreateAuction,
      redirectAuction: () => push('/auction')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AuctionAdd);
