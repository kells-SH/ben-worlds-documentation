
export const operatorUtils = {
  getDaySinceEpoch,
  toLocaleString,
}

const msInADay = 1000 * 60 * 60 * 24;


function getDaySinceEpoch(): number {
  return Math.floor(Date.now() / msInADay);
}


function toLocaleString(separator: string, num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}