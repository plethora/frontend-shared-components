import styles from './button.less';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { omit } from 'lodash';

export default class Button extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    link: PropTypes.bool,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
  };

  render() {
    let props = omit(this.props, ['primary', 'link', 'children']);
    let className = cx(this.props.className, styles.btn, {
      [styles['btn-disabled']]: this.props.disabled,
      [styles['btn-primary']]: this.props.primary,
      [styles['btn-link']]: this.props.link
    });
    return (
      <button {...props} className={className}>
        <div className={cx(styles.content, {[styles['btn-link']]: this.props.link})}>
          {this.props.children}
        </div>
      </button>);
  }
}
