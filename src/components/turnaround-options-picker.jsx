/* eslint-disable no-unsafe-finally */
'use strict';
import { bindAll, get, compact, find } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import onClickOutside from 'react-onclickoutside';

import PopUp from './pop-up';
import addBusinessDays from '../helpers/addBusinessDays';
import { momentToPlainDate } from '../helpers/turnarounds';
import "regenerator-runtime/runtime.js";

class TurnaroundOptionsPicker extends PopUp {
  static propTypes = {
    eventTypes: PropTypes.arrayOf(PropTypes.string),
    order: PropTypes.object,
    selectedMoment: PropTypes.instanceOf(moment),
    turnaroundOptions: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static handlers = [
    'handleSelectDate',
    'togglePopup',
  ];

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      today: this.getToday(),
      todayMoment: this.getToday(true),
      defaultOption: this.getDefaultOption(),
      blackOutDays: [],
      localTimeCutoff: null
    }
    bindAll(this, TurnaroundOptionsPicker.handlers);
    this.container = React.createRef();
  }

  componentDidMount() {
    const { noOrder } = this.props;

    if(!noOrder){
      //everytime component mounts, update target completion to default turnaround days + today
      let newTurnaroundDate = addBusinessDays(this.getToday(false, true), get(this.state.defaultOption, 'turnaround_days'), this.state.blackOutDays, this.state.localTimeCutoff)
      this.handleSelectDate(newTurnaroundDate, this.state.defaultOption);
    }

    return Promise.all([
      this.props.api.get('/blackout_days'),
      this.props.api.get('/variable_configs/latest')
    ])
    .then(([blackoutDaysResponse, configResponse]) => {
      return this.setState({
        blackOutDays: blackoutDaysResponse.data,
        localTimeCutoff: configResponse.data.config.localTimeCutoff
      })
    }, err => {
      console.error(err);
    });

  }

  getDefaultOption() {
    const { turnaroundOptions } = this.props
    let defaultOption = null
    for (let index = 0; index < turnaroundOptions.length; index++) {
      const turnaroundOption = turnaroundOptions[index];

      if (turnaroundOption.is_default) {
        defaultOption = turnaroundOption
        break;
      }
    }

    return defaultOption;
  }

  getToday(asMoment, monthFirst) {
    let today = moment().format("YYYY-MM-DD");
    if(monthFirst) {
      today = moment().format("MM-DD-YYYY");
    }
    if (asMoment) {
      today = moment();
    }
    return today;
  }

  renderDropdown() {
    const { turnaroundOptions, onToggle, quantity, styles } = this.props;
    return (
        <div className={styles ? styles["turnaroundOption__dropdown"] : "turnaroundOption__dropdown"}>
          {turnaroundOptions.map((turnaroundOption, i) => {
            const selectionDate = addBusinessDays(this.getToday(false, true), turnaroundOption.turnaround_days, this.state.blackOutDays, this.state.localTimeCutoff)
            const turnaround = this.findTurnaroundByMoment(selectionDate);
            const hasAvailability = quantity <= turnaround.max_quantity;
            return (
              <div className={styles ? styles["turnaroundOption__option"] : "turnaroundOption__option"}
                key={i}
                style={!hasAvailability? {pointerEvents: 'none',cursor:'not-allowed !important', backgroundColor:'#dddddd', color:'#777777'}: {}}
                onClick={() => {
                  this.handleSelectDate(selectionDate, turnaroundOption);
                  if (onToggle) onToggle();
                  if (this.togglePopup) this.closePopup();
                }}>
                <div className={styles ? styles["turnaroundOption__count"] : "turnaroundOption__count"}>
                  {turnaroundOption.name}
                </div>
                <div className="turnaroundOption_cost">
                  {turnaroundOption.turnaroundOption > 1 && (
                    <div className="turnaroundOption__unit">
                      each ${(turnaroundOption.totalturnaroundOption / turnaroundOption.turnaroundOption).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className={styles ? styles["turnaroundOption__warning"] : "turnaroundOption__warning"}>
            *Options are disabled if capacity is at max for the selected range
          </div>
        </div>
    );
  }

  findTurnaroundByMoment(m) {
    const { turnarounds } = this.props;
    const dateToFind = momentToPlainDate(m).join('-');

    for (let index = 0; index < turnarounds.length; index++) {
      const turnaround = turnarounds[index];

      if (turnaround.date.join('-') === dateToFind) {
        return turnaround;
      }
    }
    return { max_quantity: 0 };
  }

  /**
   * @param {Moment} m - `moment()` representing clicked date
   * @param {Object?} event - When present, available turnaround in the schedule
   */
  handleSelectDate(m, turnaroundOption) {
    const { selectShipDate, noOrder, setTurnaround, turnaroundOptions } = this.props;
    if (noOrder) {
      //this is for autoquote and manual quote page
      const { turnaround, turnaround_idx } = this.findTurnaroundDay(turnaroundOptions, turnaroundOption.turnaround_days);

      setTurnaround({ turnaround_idx });
      requestTrackingEvent({
        name: 'Change Turnaround',
        properties: { 'Turnaround Days': turnaround.days },
      });
    } else {
      //this is for when on account page or checkout
      selectShipDate({
        desiredShipDate: momentToPlainDate(m),
        turnaroundOption
      });
    }
    this.closePopup();
  }

  findTurnaroundDay(turnarounds, turnaroundDay) {
    for (let i = 0; i < turnarounds.length; i++) {
      const turnaround = turnarounds[i];
      if (turnaround.turnaround_days === turnaroundDay) {
        return { turnaround, turnaround_idx: i };
      }
    } 
  }

  render() {
    const {
      caret,
      turnaroundUpdatedAutomatically,
      turnaroundOptions,
      orderTurnaroundtime,
      selectedPart,
      noOrder,
      styles,
      turnarounds
    } = this.props;

    const {
      togglePopup,
    } = this;

    const { defaultOption, open } = this.state;
    const selectedPartTurnaround = selectedPart ? turnaroundOptions[selectedPart.turnaround_idx] : null;
    let selected = noOrder ? selectedPartTurnaround ? get(selectedPartTurnaround, 'name') : get(find(turnaroundOptions, t => t.turnaround_days >= selectedPart.defaultTurnaroundTime), 'name') : orderTurnaroundtime ? get(find(turnaroundOptions, t => t.turnaround_days >= orderTurnaroundtime), 'name') : defaultOption ?defaultOption : 'No Options Available';
    if (turnarounds && !selected) selected = "Loading...";
    return (
      <div>
      {noOrder && this.renderDropdown()}
      {!noOrder && 
        <div style={{display:'flex', position: 'relative', paddingTop: "5px", maxWidth: "162px", minHeight: "38px"}}>
          <div className={styles ? styles["turnarounds"] : "turnarounds"} style={{'flex':'1 1 auto', 'marginLeft': '1px'}} ref={this.container}>
            <div className={styles ? styles["plethora-calendar"] : "plethora-calendar"} style={{width:'-webkit-fill-available', zIndex:'0', paddingBottom:'3px',paddingTop:'3px'}}>
              <div className={styles ? styles["plethora-calendar__selected"] : "plethora-calendar__selected"} onClick={() => { 
                if (turnarounds) togglePopup(); 
              }}>
                {turnarounds ? selected : "Loading..."}
                <img src={caret} style={{width:'13px'}}/>
                {turnaroundUpdatedAutomatically && (<span className="type-orange asterisk-warning">*</span>)}
              </div>
            </div>
            {open && this.renderDropdown()}
          </div>
        </div>
      }
      </div>
    );
  }
}

export default (onClickOutside(TurnaroundOptionsPicker));
