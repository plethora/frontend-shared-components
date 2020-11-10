import { isBoolean } from 'lodash';
import { PureComponent } from 'react';

export default class PopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  /**
   * @param {Boolean} [open=!this.state.open] - Opens when true, closes when false, toggles when undefined
   */
  togglePopup(open) {
    const newState = isBoolean(open) ? open : !this.state.open;
    this.setState({
      open: newState,
    });
  }

  openPopup() {
    this.togglePopup(true);
  }

  closePopup() {
    this.togglePopup(false);
  }

  handleClickOutside(event) {
    this.closePopup();
  }
}
