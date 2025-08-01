import { CodeBlockEvent, Component, PropTypes } from "horizon/core";

//In Typescript we need to define what the event and parameters are before we can send the event
const stringMessage = new CodeBlockEvent<[message: string]>('stringMessage', [PropTypes.String]);

class SendMessage extends Component<typeof SendMessage> {
  static propsDefinition = {
    //Using the properties panel allows you to have different messages sent to different receivers, while only writing this script once
    message: { type: PropTypes.String, default: 'Fill Out Here Or On Properties Panel' },
    receiver: { type: PropTypes.Entity },
  };

  start() {
    //This makes sure the receiver has been filled out on the properties panel
    if (this.props.receiver) {
      //The codeblock event is "stringMessage" and has a string parameter
      this.sendCodeBlockEvent(this.props.receiver, stringMessage, this.props.message);
    }
  }
}
Component.register(SendMessage);
