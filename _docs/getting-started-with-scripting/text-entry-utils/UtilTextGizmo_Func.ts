//Vidyuu TextGizmo Formatting Library, Created By Laex05, Use Discord To Provide Feedback
import { Color } from "horizon/core";

export const formatting = {
  applyFormat,
  applyFont,
  applyMaterial,
  applyGradient,
  applyColor,
  applyAlpha,
  applyHighlight,
  specialFormats: {
    applyCharacterSpacing,
    applyLineHeight,
    applyFontSize,
    applyMonoSpacing,
    applyRotation,
    applyPosition,
    applyVerticalOffset,
    align: {
      applyLeft,
      applyCenter,
      applyRight,
    },
  },
  lineBreak: '<br>',
  doubleBreak: '<br><br>',
  getSprite,
  getDropCapSprite,
  capitalizeFirst,
} as const;


function applyFormat(format: Formats, msg: string): string {
  return format + msg + '</' + format.slice(1);
}

function applyFont(font: Fonts, msg: string): string {
  return font + msg + '</font>';
}

function applyMaterial(material: Materials, msg: string): string {
  return material + msg + '</material>';
}

function applyGradient(gradient: Gradients, msg: string): string {
  return gradient + msg + '</gradient>';
}

export enum Formats {
  bold = '<b>',
  italic = '<i>',
  underline = '<u>',
  strikethrough = '<s>',
  noparse = '<noparse>',
  subscript = '<sub>',
  superscript = '<sup>',
  uppercase = '<uppercase>',
  lowercase = '<lowercase>',
  smallcaps = '<smallcaps>',
}

export enum Fonts {
  bangers = '<font=bangers sdf>',
  anton = '<font=anton sdf>',
  robotoBold = '<font=roboto-bold sdf>',
  oswaldBold = '<font=oswald bold sdf>',
  electronicHighwaySign = '<font=electronic highway sign sdf>',
}

export enum Materials {
  antonDropShadow = '<material=anton sdf - drop shadow>',
  antonOutline = '<material=anton sdf - outline>',
  bangersDropShadow = '<material=bangers sdf - drop shadow>',
  bangersOutline = '<material=bangers sdf - outline>',
  bangersLogo = '<material=bangers sdf logo>',
  robotoBoldDropShadow = '<material=roboto-bold sdf - drop shadow>',
  liberationSansDropShadow = '<material=LiberationSans sdf - drop shadow>',
  liberationSansMetallicGreen = '<material=LiberationSans sdf - metallic green>',
  liberationSansOverlay = '<material=LiberationSans sdf - overlay>',
}

export enum Gradients {
  yellowToOrangeVertical = '<gradient=”Yellow To Orange - Vertical”>',
  darkToLightGreenVertical = '<gradient=”Dark To Light Green - Vertical”>',
  lightToDarkGreenVertical = '<gradient=”Light To Dark Green - Vertical”>',
  blueToPurpleVertical = '<gradient=”Blue To Purple - Vertical”>',
}

/**
 * Get a smiley Sprite
 * @param index a number from 0 through 15
 * @returns string to be displayed on a Horizon TextGizmo
 */
function getSprite(index: number): string {
  const spriteIndex = Math.floor(index % 16);

  return '<sprite=' + spriteIndex.toString() + '>';
}

/**
 * Get a dropcap number Sprite
 * @param index a number from 0 through 9
 * @returns string to be displayed on a Horizon TextGizmo
 */
function getDropCapSprite(index: number): string {
  const spriteIndex = Math.floor(index % 10);

  return '<sprite="dropcap numbers" index=' + spriteIndex.toString() + '>';
}

function applyCharacterSpacing(amount: number, msg: string): string {
  return '<cspace=' + amount.toString() + '>' + msg + '</cspace>';
}

function applyLineHeight(amount: number, msg: string): string {
  return '<line-height=' + amount.toString() + '>' + msg + '</line-height>';
}

function applyFontSize(size: number, msg: string): string {
  return '<size=' + size.toString() + '>' + msg + '</size>';
}

function applyMonoSpacing(amount: number, msg: string): string {
  return '<mspace=' + amount.toString() + '>' + msg + '</mspace>';
}

function applyRotation(degrees: number, msg: string): string {
  return '<rotate=' + degrees.toString() + '>' + msg + '</rotate>';
}

function applyPosition(pos: number, msg: string, usePercent: boolean = false): string {
  if (usePercent) {
    return '<pos=' + pos.toString() + '%>' + msg + '</pos>';
  }
  else {
    return '<pos=' + pos.toString() + 'em>' + msg + '</pos>';
  }
}

function applyVerticalOffset(pos: number, msg: string, usePercent: boolean = false): string { //is percent an option here??
  const suffix = usePercent ? '%' : 'em';
  
  return '<voffset=' + pos.toString() + suffix + msg + '</voffset>';
}

function applyLeft(msg: string): string {
  return applyAlignment('left', msg);
}

function applyCenter(msg: string): string {
  return applyAlignment('center', msg);
}

function applyRight(msg: string): string {
  return applyAlignment('right', msg);
}

function applyAlignment(type: string, msg: string): string {
  return '<align=' + type + '>' + msg + '</align>';
}

/**
 * Apply a color to some string msg, option for transparency
 * @param color a Horizon Color (values from 0 to 1)
 * @param msg the msg to effect
 * @param transparency option to apply transparency (values from 0 to 1, default 1)
 * @returns the msg with color applied
 */
function applyColor(color: Color, msg: string, transparency: number = 1): string {
  return '<color=#' + colorValueToHex(color.r) + colorValueToHex(color.g) + colorValueToHex(color.b) + colorValueToHex(transparency) + '>' + msg + '</color>';
}

/**
 * Apply transparency to some string msg
 * @param msg the msg to effect
 * @param transparency values from 0 to 1
 * @returns the msg with transparency applied
 */
function applyAlpha(transparency: number, msg: string): string {
  return '<alpha=#' + colorValueToHex(transparency) + '>' + msg + '</color>';
}

/**
 * Apply a highlight to some string msg
 * @param color a Horizon Color (values from 0 to 1)
 * @param msg the msg to effect
 * @param transparency option to apply transparency (values from 0 to 1, default 0.5)
 * @returns the msg with highlight applied
 */
function applyHighlight(color: Color, msg: string, transparency: number = 0.5): string {
  return '<mark=#' + colorValueToHex(color.r) + colorValueToHex(color.g) + colorValueToHex(color.b) + colorValueToHex(transparency) + '>' + msg + '</mark>';
}

function colorValueToHex(percent: number): string {
  return Math.round(Math.max(Math.min(percent, 1), 0) * 255).toString(16).padStart(2, '0');
}

/**
 * Capitalize the first count characters in some msg
 * @param msg the msg to capitalize
 * @param count number of letters to capitalize, default 1
 * @returns the updated msg
 */
function capitalizeFirst(msg: string, count: number = 1): string {
  const intCount = Math.floor(count);

  if (intCount < 0) {
    return msg;
  }
  else {
    const firstPart = msg.slice(0, intCount).toUpperCase();
    const secondPart = msg.slice(intCount);

    return firstPart + secondPart;
  }

}