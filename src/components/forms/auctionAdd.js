import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Create } from '../../modules/auction';

class AuctionAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      room: '',
      minimumAllowedBid: 0,
      isActive: true,
      isRunning: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const fieldValue =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    this.setState({ [event.target.name]: fieldValue });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.room && this.state.minimumAllowedBid > 0) {
      this.props.Create(this.state);
    } else {
      alert('Please fill required fields with valid information and try again');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          Room:
          <select
            name="room"
            value={this.state.value}
            onChange={this.handleChange}>
            <option key="0" value="" />
            {this.props.rooms.length &&
              this.props.rooms.map(item => {
                return (
                  item.isActive && (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  )
                );
              })}
          </select>
        </label>
        <br />
        <label>
          Minimum Allowed Bid:
          <input
            name="minimumAllowedBid"
            type="text"
            value={this.state.minimumAllowedBid}
            onChange={this.handleChange}
          />{' '}
          BHT
        </label>
        <br />
        <label>
          Is active:
          <input
            name="isActive"
            type="checkbox"
            checked={this.state.isActive}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          Make it Live:
          <input
            name="isRunning"
            type="checkbox"
            checked={this.state.isRunning}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <input type="submit" value="Save" />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.auction.error,
  rooms: state.room.list
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Create
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(AuctionAddForm);
