import { compact, get, find, map, range, toInteger, round, toNumber } from 'lodash';
import moment from 'moment';

/**
 * @param {Order}     order
 * @param {PlainDate} order.target_completion_date
 * @param {integer}   order.detail.turnaround_time
 * @param {Object[]} turnarounds - array of available turnarounds
 */

function orderPartPrice(operands) {
  const { multiplier, setupCost, quantity, unitCost } = operands;
  const { digits } = operands;

  let { finishingFixedCost, finishingUnitCost } = operands;
  finishingFixedCost = finishingFixedCost || 0;
  finishingUnitCost = finishingUnitCost || 0;

  const machiningPrice = setupCost + quantity * unitCost;
  const finishingPrice = finishingFixedCost + quantity * finishingUnitCost;
  const total = machiningPrice * multiplier + finishingPrice;
  return round(total, digits || 2);
}

export function momentToPlainDate(moment) {
  return moment.format('YYYY-M-D').split('-').map(toNumber);
}

export function getSelectedTurnaround(order, turnarounds) {
  const desiredShipDate = order.target_completion_date;
  const turnaroundTime = get(order, 'detail.turnaround_time');
  if (!desiredShipDate || !turnaroundTime) return null;

  const quantity = get(order, 'parts[0]._pivot_quantity', 1);

  return find(turnarounds, turnaround => {
    const dateMatches = turnaround.date.join('-') === desiredShipDate.join('-');
    const quantityMatches = turnaround.max_quantity >= quantity;
    const turnaroundTimeMatches = turnaround.days === turnaroundTime;
    return dateMatches && quantityMatches && turnaroundTimeMatches;
  });
}

export function getAvailableTurnaround(order, turnarounds) {
  const quantity = get(order, 'parts[0]._pivot_quantity');
  return find(turnarounds, turnaround => turnaround.max_quantity >= quantity);
}

export function getTurnaroundMoment(turnaround) {
  return moment(turnaround.date.join('-'), 'YYYY-MM-DD');
}

/**
 * @param {Object} turnaround - turnaround for pricing information
 * @param {Object} quote
 * @returns {object[]}
 */
export function buildPrices(turnaround, quote) {
  const setupCost = quote.setup_cost;
  const unitCost = quote.unit_cost;
  const finishingFixedCost = get(quote, 'finishing_fixed_cost', 0);
  const finishingUnitCost = get(quote, 'finishing_unit_cost', 0);

  const maxQuantity = get(turnaround, 'max_quantity');
  if (!maxQuantity) {
    return [];
  }
  return map(range(1, maxQuantity + 1), quantity => {
    return {
      totalPrice: orderPartPrice({
        multiplier: turnaround.multiplier,
        unitCost,
        quantity,
        setupCost,
        finishingFixedCost,
        finishingUnitCost,
      }).toFixed(2),
      quantity,
      days: turnaround.days,
    };
  });
}

/**
 * @param {Object[]} turnarounds - turnarounds for pricing information
 * @param {Object} order
 * @returns {object[]}
 */
export function buildSchedule(turnarounds, order) {
  const quantity = get(order, 'parts[0]._pivot_quantity');
  const quote = get(order, 'parts[0].active_quote');

  return compact(map(turnarounds, turnaround => {
    const prices = buildPrices(turnaround, quote);
    let price = find(prices, { quantity });
    if (!price) {
      return;
    }

    price = Math.ceil(price.totalPrice).toFixed(0);
    const turnaroundMoment = getTurnaroundMoment(turnaround);
    return {
      text: '$' + price,
      moment: turnaroundMoment,
      month: turnaroundMoment.month(),
      date: turnaroundMoment.date(),
      year: turnaroundMoment.year(),
    };
  }));
}

export function getPriceForQuantity(prices, quantity) {
  return find(prices, { quantity: toInteger(quantity) });
}
