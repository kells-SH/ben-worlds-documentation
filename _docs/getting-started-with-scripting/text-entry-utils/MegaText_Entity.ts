import { Component, PropTypes, TextGizmo } from "horizon/core";

class MegaText extends Component<typeof MegaText> {
  static propsDefinition = {
    line1: { type: PropTypes.String, default: '' },
    line2: { type: PropTypes.String, default: '' },
    line3: { type: PropTypes.String, default: '' },
    line4: { type: PropTypes.String, default: '' },
    line5: { type: PropTypes.String, default: '' },
    line6: { type: PropTypes.String, default: '' },
    line7: { type: PropTypes.String, default: '' },
    line8: { type: PropTypes.String, default: '' },
    line9: { type: PropTypes.String, default: '' },
    line10: { type: PropTypes.String, default: '' },
    line11: { type: PropTypes.String, default: '' },
    line12: { type: PropTypes.String, default: '' },
    line13: { type: PropTypes.String, default: '' },
    line14: { type: PropTypes.String, default: '' },
    line15: { type: PropTypes.String, default: '' },
    line16: { type: PropTypes.String, default: '' },
  };

  start() {
    const displayMe = this.props.line1 +
      this.props.line2 + this.props.line3 +
      this.props.line4 + this.props.line5 +
      this.props.line6 + this.props.line7 +
      this.props.line8 + this.props.line9 +
      this.props.line10 + this.props.line11 +
      this.props.line12 + this.props.line13 +
      this.props.line14 + this.props.line15 +
      this.props.line16;

    this.entity.as(TextGizmo)?.text.set(displayMe);
  }
}
Component.register(MegaText);

