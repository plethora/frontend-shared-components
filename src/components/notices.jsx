/**
 * Exports Notices
 *
 * @module Components/Notices
 */

import PropTypes from 'prop-types';

import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Button from './button.jsx';
import Carousel from './carousel.jsx';
import Cross from './cross.jsx';
import Icon from './icon.jsx';
import styles from './notices.less';
import Fade from './fade.jsx'

class Notices extends React.Component {
  static propTypes = {
    notices: PropTypes.array.isRequired,
    onNoticeClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
  };

  renderNotices() {
    return (
      <Fade in={this.props.visible}>
        <div className={styles.container}>
          <Icon ref="icon"
                className={styles.tail}
                name={"caret-up"}/>
          <div className={styles.bar}>
            <div className={styles.title}>
              For Your Information
            </div>
            <Cross onClick={this.props.onCloseClick}
                   className={styles.cross} />
          </div>
          <Carousel>
            {this.props.notices.map((notice, i) => {
               return (
                 <CSSTransition
                   classNames="carousel"
                   timeout={300}
                   key={i}
                 >
                   <div className={styles.notice}>
                     <div className={styles.description}>
                       <Button link onClick={this.props.onNoticeClick.bind(this, notice, true)}>
                         {notice.title}
                       </Button>
                       {` - ${notice.description}`}
                     </div>
                   </div>
                 </CSSTransition>
               );
             })}
          </Carousel>
        </div>
      </Fade>
    );
  }

  render() {
    return (
      <div className={styles.notices}
           onClick={e => e.stopPropagation()}>
        {this.renderNotices()}
      </div>
    );
  }
}

export default Notices;
