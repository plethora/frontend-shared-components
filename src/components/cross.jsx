import styles from './cross.less';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

export default class Cross extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    invert: PropTypes.bool
  };

  render() {
    let className = cx(
      this.props.className,
      styles.cross,
      {[styles.invert]: this.props.invert}
    );

    return (
      <div className={className}
           onClick={this.props.onClick} />
    );
  }
}
