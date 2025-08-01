import { Component, TextGizmo } from "horizon/core";
import { Formats, formatting } from "UtilTextGizmo_Func";

class EasyText extends Component<typeof EasyText> {
  static propsDefinition = {};

  start() {
    let title = 'Title Here:';
    title = formatting.applyFormat(Formats.bold, title);
    title = formatting.specialFormats.applyFontSize(2, title);
    title = formatting.applyFormat(Formats.underline, title);
    const lineOne = 'Some Text Here';
    const lineTwo = 'Something Else Here';

    const displayMe = title + formatting.doubleBreak + lineOne + formatting.lineBreak + lineTwo;

    this.entity.as(TextGizmo)?.text.set(displayMe);
  }
}
Component.register(EasyText);

