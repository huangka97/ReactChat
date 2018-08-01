import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomName: "Party Place",
      userName: "",
      rooms: ["Party Place", "Josh's Fun Time", "Sandwich Connoisseurs", "CdT"]
    };
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected');
      var user = prompt("Enter username");
      this.setState({userName: user});
      this.state.socket.emit("username",this.state.userName);
      this.join("Party Place");
      this.state.socket.emit("Entered room", this.state.roomName)


    });

    this.state.socket.on('errorMessage', message => {

      alert(message)
    });
  }

  join(room) {
    // room is called with "Party Place"
    console.log(this.state.userName)
    this.setState({roomName:room});
    this.state.socket.emit("room", room)
  }
  render() {
    return (<div>
      <h1>React Chat</h1>
      <ChatRoomSelector rooms={this.state.rooms} roomName={this.state.roomName} onSwitch={(e)=>this.join(e)}/>
      <ChatRoom socket={this.state.socket} roomName={this.state.roomName} username={this.state.userName}/>
    </div>);
  }
}
class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: [],
      value: ""
    }
  }
  componentDidMount() {
    this.props.socket.on("message", (message)=>{
      console.log("connected");
      var msgArray1 = this.state.messages.slice();
      msgArray1.push(`${message.username}: ${message.content}`);
      this.setState({messages: msgArray1})
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.roomName !== this.props.roomName) {
      this.setState({messages: []})
    }

  }
  change(event) {
    console.log("ENTERED CHANGE")
    this.setState({message: event.target.value, value: event.target.value})

  }
  clear(event) {
    event.preventDefault();
    console.log("ENTERED CLEAR")
    this.props.socket.emit('message',this.state.message);
    var messagearray1 = this.state.messages.slice();
    messagearray1.push(`${this.props.username}:${this.state.message}`);
    this.setState({messages: messagearray1, message: "", value: ""})
  }
  render() {
    console.log(this.state.username)
    return (<section class="container">
      <h1 className="center">Chat</h1>

      <div className="row">
        <div className="col-md-6 box">

          <div className="textbox">
            <ul className="list1">
              {
                this.state.messages.map((msg) => <li>{msg}
                </li>)
              }
            </ul>
            <ul className="list"></ul>
          </div>
          <div className="inputbox block">
            <form onSubmit={this.clear.bind(this)}>
              <input className="inline typebox" id="msg" value={this.state.value} onChange={this.change.bind(this)} type="text" placeholder="Say Something..."/>
              <button className="inline submitbutton" id="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>)
  }
}

class ChatRoomSelector extends React.Component {

  render() {
    return (

      <ul className="nav nav-tabs">
        {this.props.rooms.map((event)=>event===this.props.roomName?
          <li className="active" role="presentation" onClick={()=>{this.props.onSwitch(event)}}>
            <a href="#">{event}</a>
          </li>:<li className="" role="presentation" onClick={()=>{this.props.onSwitch(event)}}><a href="#">{event}</a></li>)
        }

    </ul>)

  }
}

export default App;
