import React, { PureComponent } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { Info, Notices } from '../components';
import styles from './pricing-table.less';

export default class PricingTable extends PureComponent {
  static propTypes = {
    part: PropTypes.shape({
      quantity: PropTypes.number.isRequired
    }),
    setupCost: PropTypes.number.isRequired,
    unitCost: PropTypes.number.isRequired,
    requestHighlight: PropTypes.func,
    notices: PropTypes.array
  };
  constructor(props) {
    super(props);
    this.state={
      visible: true
    }
  }

  renderIcon() {
    const {notices} = this.props
    if (notices && notices.length > 0) {
      let iconClass = styles.icon
      return (
        <div className={styles.notice}>
          <Info className={iconClass}
                onClick={e => {
                  e.stopPropagation();
                  this.setState({ visible: !this.state.visible })
                }} />
        </div>
      );
    }
  }

  renderNotices() {
    const {notices, requestHighlight} = this.props
    if (notices && notices.length > 0) {
      return (
        <Notices notices={notices}
               onNoticeClick={node => requestHighlight(node, true)}
               onCloseClick={e => this.setState({ visible: false })}
               visible={this.state.visible} />
      );
    }
  }

  calculatePricePerPiece() {
    const { unitCost, setupCost, part } = this.props
    const cost = (setupCost + (unitCost * part.quantity))/part.quantity

    return cost.toFixed(2)
  }

  calculateQuantitySubtotal() {
    const { unitCost, setupCost, part } = this.props
    const cost = setupCost + (unitCost * part.quantity)

    return cost.toFixed(2)
  }

  calculateSubtotalPPP() {
    //add all rows of price per piece here
    //currently only quantity
    return this.calculatePricePerPiece()
  }

  calculateSubtotal() {
    //add all subtotal rows here
    //currently only quantity
    return this.calculateQuantitySubtotal()
  }

  renderQuantityRow() {
    const {part} = this.props
    return (
      <tr key={'pricing-table-quantity-'+uuid()}>
      <td className="item">
        Quantity {part.quantity}
      </td>
      <td className="price-per-piece">
       ${this.calculatePricePerPiece()}
      </td>
      <td className="subtotal">
        ${this.calculateQuantitySubtotal()}
      </td>
    </tr>
    )
  }

  renderSubtotalRow() {
    return (
      <tr key={'subtotal-'+uuid()}>
      <td className="item">
        Subtotal
      </td>
      <td className="price-per-piece">
        ${this.calculateSubtotalPPP()}
      </td>
      <td className="subtotal">
        <span style={{display: 'flex', justifyContent: 'space-between'}}>
           ${this.calculateSubtotal()}
            {this.renderIcon()}
        </span>
      </td>
    </tr>
    )
  }

  renderHeading() {
    return (
      <thead>
      <tr>
        <th>Item</th>
        <th>Price per piece</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    )
  }



  render() {
    const {part} = this.props

    if (!part) return <span>Checkout to see price</span>
    return (
      <div className={this.props.className}>
        <table>
            {this.renderHeading()}
          <tbody>
            {this.renderQuantityRow()}
            {this.renderSubtotalRow()}
          </tbody>
        </table>
        <div>
          {this.renderNotices()}
        </div>
      </div>
    );
  }
}
