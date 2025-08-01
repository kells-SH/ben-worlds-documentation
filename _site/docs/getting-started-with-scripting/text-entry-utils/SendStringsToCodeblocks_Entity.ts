import { CodeBlockEvent, Component, PropTypes } from "horizon/core";

//In Typescript we need to define what the event and parameters are before we can send the event
const stringMessages = new CodeBlockEvent<[messages: string[]]>('stringMessages', [PropTypes.StringArray]);

class SendMessages extends Component<typeof SendMessages> {
  static propsDefinition = {
    receiver: { type: PropTypes.Entity },
  };

  start() {
    //This makes sure the receiver has been filled out on the properties panel
    if (this.props.receiver) {
      //The codeblock event is "stringMessages" and has a string list parameter
      this.sendCodeBlockEvent(this.props.receiver, stringMessages, messages);
    }
  }
}
Component.register(SendMessages);


//We are not using the properties panel because we cannot edit string lists from the properties panel, we'll type all the string values here in Typescript
const messages: string[] = [
  'item1',
  'item2',
  'item3',
  //Duplicate for as many items as you need
  //I have used single ticks to denote the string, but you can also use double ticks (quotes), or back ticks
  //Back ticks might be the best option because then you can include both single and double ticks in your message, for example:
  `This "message" was written in back ticks, so it can use quotes and single ticks, ie. apostrophes, that's nice!`,
];
