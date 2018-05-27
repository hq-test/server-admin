import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import Partner from '../partner';
import PartnerAdd from '../partner/add';
import Room from '../room';
import RoomAdd from '../room/add';
import Auction from '../auction';
import AuctionAdd from '../auction/add';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSocketConnect: false
    };
  }

  componentDidMount() {
    var that = this;
    window.IO.socket.on('connect', function() {
      that.setState({ isSocketConnect: true });
    });

    window.IO.socket.on('reconnect', function() {
      that.setState({ isSocketConnect: true });
    });
    window.IO.socket.on('reconnecting', function() {
      that.setState({ isSocketConnect: false });
    });

    window.IO.socket.on('disconnect', function(data) {
      window.IO.socket._raw.io._reconnection = true;
      that.setState({ isSocketConnect: false });
    });

    window.IO.socket.on('error', () => {
      that.setState({ isSocketConnect: false });
    });
  }

  componentWillUnmount() {
    window.IO.socket.off('connect');
    window.IO.socket.off('message');
    window.IO.socket.off('reconnect');
    window.IO.socket.off('reconnecting');
    window.IO.socket.off('disconnect');
    window.IO.socket.off('error');
  }

  render() {
    return (
      <div>
        <div
          className={
            this.state.isSocketConnect
              ? 'socketConnected'
              : 'socketDisconnected'
          }
        />

        {/* show navigation for pages agter login */}
        <header>
          <Link style={{ padding: 10 }} to="/">
            Home
          </Link>
          <Link style={{ padding: 10 }} to="/partner">
            Partner
          </Link>
          <Link style={{ padding: 10 }} to="/room">
            Room
          </Link>
          <Link style={{ padding: 10 }} to="/auction">
            Auction
          </Link>
        </header>

        {/* pages placeholder with routes */}
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/partner" component={Partner} />
          <Route exact path="/partner/add" component={PartnerAdd} />
          <Route exact path="/room" component={Room} />
          <Route exact path="/room/add" component={RoomAdd} />
          <Route exact path="/auction" component={Auction} />
          <Route exact path="/auction/add" component={AuctionAdd} />
        </main>
      </div>
    );
  }
}
export default App;
