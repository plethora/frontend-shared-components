/**
 * Exports Carousel
 *
 * @module Components/Carousel
 */

 import PropTypes from 'prop-types';
import React from 'react';
import styles from './carousel.less';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import Icon from './icon.jsx';

export default class Carousel extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onNext: PropTypes.func
  };

  static defaultProps = {
    onNext: () => {}
  };

  state = {
    i: 0
  };

  increment() {
    this.setState({
      i: (this.state.i + 1) % this.props.children.length
    });
    this.props.onNext();
  }

  decrement() {
    this.setState({
      i: (this.state.i + this.props.children.length - 1) % this.props.children.length
    });
    this.props.onNext();
  }

  render() {
    return (
      <div className={styles['carousel']}>
        <div className={styles['content']}>
          <div className={styles['top']}>
            <ReactCSSTransitionReplace
              className={styles['transition-group']}
              transitionName="carousel"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.props.children[this.state.i]}
            </ReactCSSTransitionReplace>
          </div>
          <div className={styles.bottom}>
            <div className={styles['left-arrow']}>
              <div className={styles.icon} onClick={this.decrement.bind(this)}>
                <Icon name="caret-left" />
              </div>
            </div>
            {this.state.i + 1}&nbsp;of&nbsp;{this.props.children.length}
            <div className={styles['right-arrow']}>
              <div className={styles.icon} onClick={this.increment.bind(this)}>
                <Icon name="caret-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
