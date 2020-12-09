'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactBootstrap = require('react-bootstrap');

var _react = require('react');

var _uuid = require('uuid');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PricingTable = function (_PureComponent) {
  _inherits(PricingTable, _PureComponent);

  function PricingTable(props) {
    _classCallCheck(this, PricingTable);

    return _possibleConstructorReturn(this, (PricingTable.__proto__ || Object.getPrototypeOf(PricingTable)).call(this, props));
  }

  _createClass(PricingTable, [{
    key: 'render',
    value: function render() {
      var rows = this.props.rows;

      return React.createElement(
        _reactBootstrap.Table,
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'Item'
            ),
            React.createElement(
              'th',
              null,
              'Subtotal'
            ),
            React.createElement(
              'th',
              null,
              'Total'
            )
          )
        ),
        React.createElement(
          'tbody',
          null,
          rows.map(function (row) {
            return React.createElement(
              'tr',
              { key: (0, _uuid.v4)() },
              React.createElement(
                'td',
                null,
                row.item
              ),
              React.createElement(
                'td',
                null,
                row.subtotal
              ),
              React.createElement(
                'td',
                null,
                row.total
              )
            );
          })
        )
      );
    }
  }]);

  return PricingTable;
}(_react.PureComponent);

exports.default = PricingTable;