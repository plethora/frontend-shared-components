'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _armyHourToTime = require('./armyHourToTime');

var _armyHourToTime2 = _interopRequireDefault(_armyHourToTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * adds business days
 * acconts for blackout days and schedule time cutoff
 * console.log(addBusinessDays(new Date(), 7).format('YYYY-MM-DD'), ['YYYY-MM-DD'], 13)
 * console.log(addBusinessDays('09-20-2018', 3).format('YYYY-MM-DD'))
 *
 * JJ_TODO ADDS EXTRA DAY IF AFTER SCHEDULE CUTOFF TIME and blackout days
 * returns moment
 */
exports.default = function (date, days, blackoutDays, localTimeCutoff) {
  //add business days
  var originalDayAsMoment = (0, _moment2.default)(new Date(date)).add(Math.floor(days / 5) * 7, 'd');
  var d = (0, _moment2.default)(new Date(date)).add(Math.floor(days / 5) * 7, 'd');
  var remaining = days % 5;

  if (blackoutDays.length) {
    //add days for each day that falls between
    blackoutDays.forEach(function (blackoutDay) {
      var momentBlackoutblackoutD = (0, _moment2.default)(blackoutDay.join('-'));

      if (momentBlackoutblackoutD.isBetween(originalDayAsMoment, d)) {
        remaining += 1;
      }
    });
  }

  //localtimecutoff is an integer in army time
  //assumes localTimeCutoff is whole number 0-24
  if (localTimeCutoff) {
    var currentTime = (0, _moment2.default)(new Date());
    var factoryCutOffTime = (0, _moment2.default)((0, _armyHourToTime2.default)(localTimeCutoff), "HH:mm a");

    if (currentTime.isAfter(factoryCutOffTime)) {
      remaining += 1;
    }
  }
  //count business days
  while (remaining) {
    d.add(1, 'd');
    if (d.day() !== 0 && d.day() !== 6) remaining -= 1;
  }

  return d;
};