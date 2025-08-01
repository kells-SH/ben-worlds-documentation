import { CodeBlockEvent, Component, PropTypes } from "horizon/core";

const receiveMessage = new CodeBlockEvent<[message: string]>('receiveMessage', [PropTypes.String]);

class Receiver extends Component<typeof Receiver> {
  static propsDefinition = {};

  preStart() {
    this.connectCodeBlockEvent(this.entity, receiveMessage, this.receiveMessages.bind(this));
  }

  start() {

  }

  receiveMessages(msg: string) {
    console.log(msg);
  }
}
Component.register(Receiver);

