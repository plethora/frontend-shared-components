import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './icon.less';

import 'font-awesome/css/font-awesome.css';

// heavily modified from https://github.com/andreypopp/react-fa (MIT license)

export default class Icon extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    padding: PropTypes.bool,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
    flip: PropTypes.oneOf(['horizontal', 'vertical']),
    fw: PropTypes.bool,
    spin: PropTypes.bool,
    pulse: PropTypes.bool,
    stack: PropTypes.oneOf(['1x', '2x']),
    inverse: PropTypes.bool
  };

  render() {
    let {
      name, size, rotate, flip, spin, fw, stack, inverse, pulse, className, ...props
    } = this.props;

    let classNames = cx(className, {[styles.root]: this.props.padding}, `fa fa-${name}`, {
      [`fa-${size}`]: size,
      [`fa-${rotate}`]: rotate,
      [`fa-${flip}`]: flip,
      [`fa-${stack}`]: stack,
      'fa-fw': fw,
      'fa-pulse': pulse,
      'fa-spin': spin,
      'fa-inverse': inverse
    });

    return <i {...props} className={classNames} />;
  }
}

