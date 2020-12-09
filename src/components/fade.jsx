import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './fade.less';

const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={{
      enter: 110,
      exit: 310,
      appear: 110,
    }}
    classNames={styles}
    unmountOnExit
  >
    {children}
  </CSSTransition>
);

Fade.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Fade;
