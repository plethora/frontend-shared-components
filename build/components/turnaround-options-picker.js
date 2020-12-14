/* eslint-disable no-unsafe-finally */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _popUp = require('./pop-up');

var _popUp2 = _interopRequireDefault(_popUp);

var _addBusinessDays = require('../helpers/addBusinessDays');

var _addBusinessDays2 = _interopRequireDefault(_addBusinessDays);

var _turnarounds = require('../helpers/turnarounds');

require('regenerator-runtime/runtime.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TurnaroundOptionsPicker = function (_PopUp) {
  _inherits(TurnaroundOptionsPicker, _PopUp);

  function TurnaroundOptionsPicker(props) {
    _classCallCheck(this, TurnaroundOptionsPicker);

    var _this = _possibleConstructorReturn(this, (TurnaroundOptionsPicker.__proto__ || Object.getPrototypeOf(TurnaroundOptionsPicker)).call(this, props));

    _this.state = {
      isOpen: false,
      today: _this.getToday(),
      todayMoment: _this.getToday(true),
      defaultOption: _this.getDefaultOption(),
      blackOutDays: [],
      localTimeCutoff: null
    };
    (0, _lodash.bindAll)(_this, TurnaroundOptionsPicker.handlers);
    _this.container = _react2.default.createRef();
    return _this;
  }

  _createClass(TurnaroundOptionsPicker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var noOrder = this.props.noOrder;


      if (!noOrder) {
        //everytime component mounts, update target completion to default turnaround days + today
        var newTurnaroundDate = (0, _addBusinessDays2.default)(this.getToday(false, true), (0, _lodash.get)(this.state.defaultOption, 'turnaround_days'), this.state.blackOutDays, this.state.localTimeCutoff);
        this.handleSelectDate(newTurnaroundDate, this.state.defaultOption);
      }

      return Promise.all([this.props.api.get('/blackout_days'), this.props.api.get('/variable_configs/latest')]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            blackoutDaysResponse = _ref2[0],
            configResponse = _ref2[1];

        return _this2.setState({
          blackOutDays: blackoutDaysResponse.data,
          localTimeCutoff: configResponse.data.config.localTimeCutoff
        });
      }, function (err) {
        console.error(err);
      });
    }
  }, {
    key: 'getDefaultOption',
    value: function getDefaultOption() {
      var turnaroundOptions = this.props.turnaroundOptions;

      var defaultOption = null;
      for (var index = 0; index < turnaroundOptions.length; index++) {
        var turnaroundOption = turnaroundOptions[index];

        if (turnaroundOption.is_default) {
          defaultOption = turnaroundOption;
          break;
        }
      }

      return defaultOption;
    }
  }, {
    key: 'getToday',
    value: function getToday(asMoment, monthFirst) {
      var today = (0, _moment2.default)().format("YYYY-MM-DD");
      if (monthFirst) {
        today = (0, _moment2.default)().format("MM-DD-YYYY");
      }
      if (asMoment) {
        today = (0, _moment2.default)();
      }
      return today;
    }
  }, {
    key: 'renderDropdown',
    value: function renderDropdown() {
      var _this3 = this;

      var _props = this.props,
          appState = _props.appState,
          onToggle = _props.onToggle,
          order = _props.order,
          quantity = _props.quantity,
          selectedPart = _props.selectedPart,
          selectedShipDate = _props.selectedShipDate,
          styles = _props.styles,
          turnaroundOptions = _props.turnaroundOptions;

      var basePrice = selectedPart && selectedShipDate ? appState === 'ReadyToAddToCart' ? (0, _lodash.get)((0, _lodash.find)((0, _lodash.get)(selectedShipDate, 'prices'), function (p) {
        return p.quantity === quantity;
      }), totalPrice) : null : order ? order.base_price : null;
      return _react2.default.createElement(
        'div',
        { className: styles ? styles["turnaroundOption__dropdown"] : "turnaroundOption__dropdown" },
        turnaroundOptions.map(function (turnaroundOption, i) {
          var selectionDate = (0, _addBusinessDays2.default)(_this3.getToday(false, true), turnaroundOption.turnaround_days, _this3.state.blackOutDays, _this3.state.localTimeCutoff);
          var previousDay = i > 0 ? turnaroundOptions[i - 1].turnaround_days : null;
          var hasAvailability = _this3.findAvailability(previousDay, turnaroundOption, quantity);
          var additionalCost = basePrice ? '+ $' + (turnaroundOption.turnaround_multiplier * basePrice - basePrice).toFixed(2) : null;
          var dollarSigns = turnaroundOption.turnaround_multiplier > 1.2 ? '+$$$' : turnaroundOption.turnaround_multiplier > 1.1 ? '+$$' : turnaroundOption.turnaround_multiplier > 1.0 ? '+$' : '';
          return _react2.default.createElement(
            'div',
            { className: styles ? styles["turnaroundOption__option"] : "turnaroundOption__option",
              key: i,
              style: !hasAvailability ? { pointerEvents: 'none', cursor: 'not-allowed !important', backgroundColor: '#dddddd', color: '#777777' } : {},
              onClick: function onClick() {
                _this3.handleSelectDate(selectionDate, turnaroundOption);
                if (onToggle) onToggle();
                if (_this3.togglePopup) _this3.closePopup();
              } },
            _react2.default.createElement(
              'div',
              { className: styles ? styles["turnaroundOption__name"] : "turnaroundOption__name" },
              turnaroundOption.name
            ),
            _react2.default.createElement(
              'div',
              { className: styles ? styles["turnaroundOption__cost"] : "turnaroundOption__cost" },
              additionalCost ? additionalCost : dollarSigns
            )
          );
        }),
        _react2.default.createElement(
          'div',
          { className: styles ? styles["turnaroundOption__warning"] : "turnaroundOption__warning" },
          '*Options are disabled if capacity is at max for the selected range'
        )
      );
    }
  }, {
    key: 'findAvailability',
    value: function findAvailability(previousDay, turnaroundOption, quantity) {
      var turnarounds = this.props.turnarounds;

      var prevIndex = (0, _lodash.findIndex)(turnarounds, function (t) {
        return t.days === previousDay + 1;
      });
      var startingIndex = prevIndex > -1 ? prevIndex : 0;

      for (var i = startingIndex; i < turnarounds.length; i++) {
        var turnaround = turnarounds[i];

        if (turnaround.days > turnaroundOption.turnaround_days && turnaroundOption.turnaround_days !== 25) return false;else if (turnaround.max_quantity >= quantity) return true;
      }
      return false;
    }

    /**
     * @param {Moment} m - `moment()` representing clicked date
     * @param {Object?} event - When present, available turnaround in the schedule
     */

  }, {
    key: 'handleSelectDate',
    value: function handleSelectDate(m, turnaroundOption) {
      var _props2 = this.props,
          noOrder = _props2.noOrder,
          requestTrackingEvent = _props2.requestTrackingEvent,
          selectShipDate = _props2.selectShipDate,
          setTurnaround = _props2.setTurnaround,
          turnaroundOptions = _props2.turnaroundOptions;

      if (noOrder) {
        //this is for autoquote and manual quote page
        var _findTurnaroundDay = this.findTurnaroundDay(turnaroundOptions, turnaroundOption.turnaround_days),
            turnaround = _findTurnaroundDay.turnaround,
            turnaround_idx = _findTurnaroundDay.turnaround_idx;

        setTurnaround({ turnaround_idx: turnaround_idx });
        requestTrackingEvent({
          name: 'Change Turnaround',
          properties: { 'Turnaround Days': turnaround.days }
        });
      } else {
        //this is for when on account page or checkout
        selectShipDate({
          desiredShipDate: (0, _turnarounds.momentToPlainDate)(m),
          turnaroundOption: turnaroundOption
        });
      }
      this.closePopup();
    }
  }, {
    key: 'findTurnaroundDay',
    value: function findTurnaroundDay(turnarounds, turnaroundDay) {
      for (var i = 0; i < turnarounds.length; i++) {
        var turnaround = turnarounds[i];
        if (turnaround.turnaround_days === turnaroundDay) {
          return { turnaround: turnaround, turnaround_idx: i };
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          caret = _props3.caret,
          turnaroundUpdatedAutomatically = _props3.turnaroundUpdatedAutomatically,
          turnaroundOptions = _props3.turnaroundOptions,
          orderTurnaroundtime = _props3.orderTurnaroundtime,
          selectedPart = _props3.selectedPart,
          noOrder = _props3.noOrder,
          styles = _props3.styles,
          turnarounds = _props3.turnarounds;
      var togglePopup = this.togglePopup;
      var _state = this.state,
          defaultOption = _state.defaultOption,
          open = _state.open;

      var selectedPartTurnaround = selectedPart ? turnaroundOptions[selectedPart.turnaround_idx] : null;
      var selected = noOrder ? selectedPartTurnaround ? (0, _lodash.get)(selectedPartTurnaround, 'name') : (0, _lodash.get)((0, _lodash.find)(turnaroundOptions, function (t) {
        return t.turnaround_days >= selectedPart.defaultTurnaroundTime;
      }), 'name') : orderTurnaroundtime ? orderTurnaroundtime <= 25 ? (0, _lodash.get)((0, _lodash.find)(turnaroundOptions, function (t) {
        return t.turnaround_days >= orderTurnaroundtime;
      }), 'name') : (0, _lodash.get)(turnaroundOptions, '[' + (turnaroundOptions.length - 1) + ']name') : defaultOption ? defaultOption : 'No Options Available';
      if (turnarounds && !selected) selected = "Loading...";
      return _react2.default.createElement(
        'div',
        null,
        noOrder && this.renderDropdown(),
        !noOrder && _react2.default.createElement(
          'div',
          { style: { display: 'flex', position: 'relative', paddingTop: "5px", maxWidth: "162px", minHeight: "38px" } },
          _react2.default.createElement(
            'div',
            { className: styles ? styles["turnarounds"] : "turnarounds", style: { 'flex': '1 1 auto', 'marginLeft': '1px' }, ref: this.container },
            _react2.default.createElement(
              'div',
              { className: styles ? styles["plethora-calendar"] : "plethora-calendar", style: { width: '-webkit-fill-available', zIndex: '0', paddingBottom: '3px', paddingTop: '3px' } },
              _react2.default.createElement(
                'div',
                { className: styles ? styles["plethora-calendar__selected"] : "plethora-calendar__selected", onClick: function onClick() {
                    if (turnarounds) togglePopup();
                  } },
                turnarounds ? selected : "Loading...",
                _react2.default.createElement('img', { src: caret, style: { width: '13px' } }),
                turnaroundUpdatedAutomatically && _react2.default.createElement(
                  'span',
                  { className: 'type-orange asterisk-warning' },
                  '*'
                )
              )
            ),
            open && this.renderDropdown()
          )
        )
      );
    }
  }]);

  return TurnaroundOptionsPicker;
}(_popUp2.default);

TurnaroundOptionsPicker.propTypes = {
  eventTypes: _propTypes2.default.arrayOf(_propTypes2.default.string),
  order: _propTypes2.default.object,
  selectedMoment: _propTypes2.default.instanceOf(_moment2.default),
  turnaroundOptions: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired
};
TurnaroundOptionsPicker.handlers = ['handleSelectDate', 'togglePopup'];
exports.default = (0, _reactOnclickoutside2.default)(TurnaroundOptionsPicker);