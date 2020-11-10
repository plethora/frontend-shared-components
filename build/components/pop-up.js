'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopUp = function (_PureComponent) {
  _inherits(PopUp, _PureComponent);

  function PopUp(props) {
    _classCallCheck(this, PopUp);

    var _this = _possibleConstructorReturn(this, (PopUp.__proto__ || Object.getPrototypeOf(PopUp)).call(this, props));

    _this.state = {
      open: false
    };
    return _this;
  }

  /**
   * @param {Boolean} [open=!this.state.open] - Opens when true, closes when false, toggles when undefined
   */


  _createClass(PopUp, [{
    key: 'togglePopup',
    value: function togglePopup(open) {
      var newState = (0, _lodash.isBoolean)(open) ? open : !this.state.open;
      this.setState({
        open: newState
      });
    }
  }, {
    key: 'openPopup',
    value: function openPopup() {
      this.togglePopup(true);
    }
  }, {
    key: 'closePopup',
    value: function closePopup() {
      this.togglePopup(false);
    }
  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside(event) {
      this.closePopup();
    }
  }]);

  return PopUp;
}(_react.PureComponent);

exports.default = PopUp;