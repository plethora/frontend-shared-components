import moment from 'moment'
import armyHourToTime from './armyHourToTime'

/**
 * adds business days
 * acconts for blackout days and schedule time cutoff
 * console.log(addBusinessDays(new Date(), 7).format('YYYY-MM-DD'), ['YYYY-MM-DD'], 13)
 * console.log(addBusinessDays('09-20-2018', 3).format('YYYY-MM-DD'))
 *
 * JJ_TODO ADDS EXTRA DAY IF AFTER SCHEDULE CUTOFF TIME and blackout days
 * returns moment
 */
export default (date, days, blackoutDays, localTimeCutoff) => {
  //add business days
  const originalDayAsMoment = moment(new Date(date)).add(Math.floor(days / 5) * 7, 'd');
  const d = moment(new Date(date)).add(Math.floor(days / 5) * 7, 'd');
  let remaining = days % 5;

  if (blackoutDays.length) {
    //add days for each day that falls between
    blackoutDays.forEach(blackoutDay => {
      const momentBlackoutblackoutD = moment(blackoutDay.join('-'))

      if (momentBlackoutblackoutD.isBetween(originalDayAsMoment, d)) {
        remaining+=1
      }
    })
  }

  //localtimecutoff is an integer in army time
  //assumes localTimeCutoff is whole number 0-24
  if(localTimeCutoff) {
    var currentTime= moment(new Date());
    var factoryCutOffTime = moment(armyHourToTime(localTimeCutoff), "HH:mm a");

    if (currentTime.isAfter(factoryCutOffTime) ) {
      remaining+=1
    }
  }
  //count business days
  while (remaining) {
    d.add(1, 'd');
    if (d.day() !== 0 && d.day() !== 6)
      remaining-=1;
  }

  return d
};
