'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.momentToPlainDate = momentToPlainDate;
exports.getSelectedTurnaround = getSelectedTurnaround;
exports.getAvailableTurnaround = getAvailableTurnaround;
exports.getTurnaroundMoment = getTurnaroundMoment;
exports.buildPrices = buildPrices;
exports.buildSchedule = buildSchedule;
exports.getPriceForQuantity = getPriceForQuantity;

var _lodash = require('lodash');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Order}     order
 * @param {PlainDate} order.target_completion_date
 * @param {integer}   order.detail.turnaround_time
 * @param {Object[]} turnarounds - array of available turnarounds
 */

function orderPartPrice(operands) {
  var multiplier = operands.multiplier,
      setupCost = operands.setupCost,
      quantity = operands.quantity,
      unitCost = operands.unitCost;
  var digits = operands.digits;
  var finishingFixedCost = operands.finishingFixedCost,
      finishingUnitCost = operands.finishingUnitCost;

  finishingFixedCost = finishingFixedCost || 0;
  finishingUnitCost = finishingUnitCost || 0;

  var machiningPrice = setupCost + quantity * unitCost;
  var finishingPrice = finishingFixedCost + quantity * finishingUnitCost;
  var total = machiningPrice * multiplier + finishingPrice;
  return (0, _lodash.round)(total, digits || 2);
}

function momentToPlainDate(moment) {
  return moment.format('YYYY-M-D').split('-').map(_lodash.toNumber);
}

function getSelectedTurnaround(order, turnarounds) {
  var desiredShipDate = order.target_completion_date;
  var turnaroundTime = (0, _lodash.get)(order, 'detail.turnaround_time');
  if (!desiredShipDate || !turnaroundTime) return null;

  var quantity = (0, _lodash.get)(order, 'parts[0]._pivot_quantity', 1);

  return (0, _lodash.find)(turnarounds, function (turnaround) {
    var dateMatches = turnaround.date.join('-') === desiredShipDate.join('-');
    var quantityMatches = turnaround.max_quantity >= quantity;
    var turnaroundTimeMatches = turnaround.days === turnaroundTime;
    return dateMatches && quantityMatches && turnaroundTimeMatches;
  });
}

function getAvailableTurnaround(order, turnarounds) {
  var quantity = (0, _lodash.get)(order, 'parts[0]._pivot_quantity');
  return (0, _lodash.find)(turnarounds, function (turnaround) {
    return turnaround.max_quantity >= quantity;
  });
}

function getTurnaroundMoment(turnaround) {
  return (0, _moment2.default)(turnaround.date.join('-'), 'YYYY-MM-DD');
}

/**
 * @param {Object} turnaround - turnaround for pricing information
 * @param {Object} quote
 * @returns {object[]}
 */
function buildPrices(turnaround, quote) {
  var setupCost = quote.setup_cost;
  var unitCost = quote.unit_cost;
  var finishingFixedCost = (0, _lodash.get)(quote, 'finishing_fixed_cost', 0);
  var finishingUnitCost = (0, _lodash.get)(quote, 'finishing_unit_cost', 0);

  var maxQuantity = (0, _lodash.get)(turnaround, 'max_quantity');
  if (!maxQuantity) {
    return [];
  }
  return (0, _lodash.map)((0, _lodash.range)(1, maxQuantity + 1), function (quantity) {
    return {
      totalPrice: orderPartPrice({
        multiplier: turnaround.multiplier,
        unitCost: unitCost,
        quantity: quantity,
        setupCost: setupCost,
        finishingFixedCost: finishingFixedCost,
        finishingUnitCost: finishingUnitCost
      }).toFixed(2),
      quantity: quantity,
      days: turnaround.days
    };
  });
}

/**
 * @param {Object[]} turnarounds - turnarounds for pricing information
 * @param {Object} order
 * @returns {object[]}
 */
function buildSchedule(turnarounds, order) {
  var quantity = (0, _lodash.get)(order, 'parts[0]._pivot_quantity');
  var quote = (0, _lodash.get)(order, 'parts[0].active_quote');

  return (0, _lodash.compact)((0, _lodash.map)(turnarounds, function (turnaround) {
    var prices = buildPrices(turnaround, quote);
    var price = (0, _lodash.find)(prices, { quantity: quantity });
    if (!price) {
      return;
    }

    price = Math.ceil(price.totalPrice).toFixed(0);
    var turnaroundMoment = getTurnaroundMoment(turnaround);
    return {
      text: '$' + price,
      moment: turnaroundMoment,
      month: turnaroundMoment.month(),
      date: turnaroundMoment.date(),
      year: turnaroundMoment.year()
    };
  }));
}

function getPriceForQuantity(prices, quantity) {
  return (0, _lodash.find)(prices, { quantity: (0, _lodash.toInteger)(quantity) });
}