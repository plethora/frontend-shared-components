
/**
 *
 * @param {Number} time - takes a whole number between 0-24
 *
 * 13 returns 1:00a
 *
 */

export default function armyHourToTime(time) {
  if (time < 0) time = 0;
  let hrs = ~~(time / 1 % 24), mins = ~~((time % 1) / 60), timeType = (hrs > 11 ? "p" : "a");
  if (hrs > 12) hrs = hrs - 12;
  if (hrs == 0) hrs = 12;
  return hrs + ":" + padZero(mins) + timeType;
}

function padZero(string){
  return ("00" + string).slice(-2);
}
