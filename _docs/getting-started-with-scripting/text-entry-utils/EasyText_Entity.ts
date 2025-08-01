import { Component, TextGizmo } from "horizon/core";

const font = '<font=Bangers SDF>';
const lineBreak = '<br>';

class EasyText extends Component<typeof EasyText> {
  static propsDefinition = {};

  start() {
    const lineOne = 'Some Text Here ' + bold('Something Bolded Here');
    const lineTwo = 'Something Else Here';

    const displayMe = font + lineOne + lineBreak + lineTwo;

    this.entity.as(TextGizmo)?.text.set(displayMe);
  }
}
Component.register(EasyText);

function bold(messageToBold: string): string {
  return '<b>' + messageToBold + '</b>';
}
