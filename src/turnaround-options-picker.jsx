'use strict';

// import { bindAll, get, compact, find } from 'lodash';
// import moment from 'moment';
// import PropTypes from 'prop-types';
import React from 'react';
// import onClickOutside from 'react-onclickoutside'
// import { connect, } from 'react-redux';
// import { bindActionCreators, } from 'redux';

// import { selectShipDate } from '../actions/order-detail';
// import PopUp from './pop-up';
// import { momentToPlainDate, } from '../utils';
// import { buildSchedule, getTurnaroundMoment, } from '../utils/turnarounds';
// import caret from '../../../../public/images/icons/caret.svg';
// import { setTurnaround } from '../../../../../add-in-web-ui/app/actions';
// import addBusinessDays from './helpers/addBusinessDays';
// import API from '../utils/api';
// import { requestTrackingEvent } from '../../../../../add-in-web-ui/app/store/addin_actions';
// import { getSelectedPart } from '../../../../../add-in-web-ui/app/utils';
// import "regenerator-runtime/runtime.js";
// import styles from '../../../../../add-in-web-ui/app/components/ship_date.less';
const Test = props => {
  return (
    <div>HELLO THIS IS A TEST</div>
  )
}

export default Test;

// const styles = {
//   // Calendar classnames
//   calendar: 'plethora-calendar__datepicker',
//   toolbar: 'plethora-calendar__toolbar',
//   hidden: 'hidden',
//   // Day class names
//   'prev-month': 'prev-month',
//   'next-month': 'next-month',
//   'available': 'available',
//   'current-day': 'current-day',
//   'daynum': 'daynum',
//   'price': 'price',
// };

// export class TurnaroundOptionsPicker extends PopUp {
//   static propTypes = {
//     eventTypes: PropTypes.arrayOf(PropTypes.string),
//     order: PropTypes.object,
//     selectedMoment: PropTypes.instanceOf(moment),
//     turnaroundOptions: PropTypes.arrayOf(PropTypes.object).isRequired
//   };

//   static handlers = [
//     'handleSelectDate',
//     'togglePopup',
//   ];

//   constructor(props) {
//     super(props);
//     this.state = {
//       isOpen: false,
//       today: this.getToday(),
//       todayMoment: this.getToday(true),
//       defaultOption: this.getDefaultOption(),
//       blackOutDays: [],
//       localTimeCutoff: null
//     }
//     bindAll(this, TurnaroundOptionsPicker.handlers);
//   }

//   async componentDidMount() {
//     await Promise.all([
//       API.get('/blackout_days'),
//       API.get('/variable_configs/latest')
//     ])
//     .then(([blackoutDaysResponse, configResponse]) => {
//       return this.setState({
//         blackOutDays: blackoutDaysResponse.data,
//         localTimeCutoff: configResponse.data.config.localTimeCutoff
//       })
//     }, err => {
//       console.error(err);
//     });

//     const { noOrder } = this.props

//     if(!noOrder){
//       //everytime component mounts, update target completion to default turnaround days + today
//       let newTurnaroundDate = addBusinessDays(this.getToday(false, true), get(this.state.defaultOption, 'turnaround_days'), this.state.blackOutDays, this.state.localTimeCutoff)
//       this.handleSelectDate(newTurnaroundDate, this.state.defaultOption)
//     }
//   }

//   getDefaultOption() {
//     const { turnaroundOptions } = this.props
//     let defaultOption = null
//     for (let index = 0; index < turnaroundOptions.length; index++) {
//       const turnaroundOption = turnaroundOptions[index];

//       if (turnaroundOption.is_default) {
//         defaultOption = turnaroundOption
//         break;
//       }
//     }

//     return defaultOption;
//   }

//   getToday(asMoment, monthFirst) {
//     let today = moment().format("YYYY-MM-DD")
//     if(monthFirst) {
//       today = moment().format("MM-DD-YYYY")
//     }
//     if (asMoment) {
//       today = moment()
//     }
//     return today
//   }

//   renderDropdown() {

//     if (!this.state.open) {
//       return null;
//     }

//     const { turnaroundOptions, quantity } = this.props
//     return (
//       <div className="turnaroundOption__dropdown" >
//         {turnaroundOptions.map((turnaroundOption, i) => {
//           const selectionDate = addBusinessDays(this.getToday(false, true), turnaroundOption.turnaround_days, this.state.blackOutDays, this.state.localTimeCutoff)
//           const turnaround = this.findTurnaroundByMoment(selectionDate);
//           const hasAvailability = quantity <= turnaround.max_quantity;
//           return (
//             <div className="quantity__option"
//               key={i}
//               style={!hasAvailability? {pointerEvents: 'none',cursor:'not-allowed !important', backgroundColor:'#dddddd', color:'#777777'}: {}}
//               onClick={() => {
//                 this.handleSelectDate(selectionDate, turnaroundOption);
//                 this.closePopup();
//               }}>
//               <div className="quantity__count">
//                 {turnaroundOption.name}
//               </div>
//               <div className="turnaroundOption_cost">
//                 {turnaroundOption.turnaroundOption > 1 && (
//                   <div className="turnaroundOption__unit">
//                     each ${(turnaroundOption.totalturnaroundOption / turnaroundOption.turnaroundOption).toFixed(2)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div className="turnaroundOption__warning">
//           *Options are disabled if capacity is at max for the selected day
//         </div>
//       </div>
//     );
//   }

//   findTurnaroundByMoment(m) {
//     const { turnarounds } = this.props
//     const dateToFind = momentToPlainDate(m).join('-')

//     for (let index = 0; index < turnarounds.length; index++) {
//       const turnaround = turnarounds[index];

//       if (turnaround.date.join('-') === dateToFind) {
//         return turnaround
//       }
//     }
//     return {max_quantity: 0}
//   }

//   /**
//    * @param {Moment} m - `moment()` representing clicked date
//    * @param {Object?} event - When present, available turnaround in the schedule
//    */
//   handleSelectDate(m, turnaroundOption) {
//     const { selectShipDate, noOrder, requestTrackingEvent, setTurnaround, selectedPart, turnaroundOptions } = this.props;
//     if (noOrder) {
//       //this is for autoquote and manual quote page
//       const { turnaround, turnaround_idx } = this.findTurnaroundDay(turnaroundOptions, turnaroundOption.turnaround_days);

//       setTurnaround({ turnaround_idx });
//       requestTrackingEvent({
//         name: 'Change Turnaround',
//         properties: { 'Turnaround Days': turnaround.days },
//       });
//     } else {
//       //this is for when on account page or checkout 
//       selectShipDate({
//         desiredShipDate: momentToPlainDate(m),
//         turnaroundOption
//       });
//     }

//     this.closePopup();
//   }

//   findTurnaroundDay(turnarounds, turnaroundDay) {
//     for (let i = 0; i < turnarounds.length; i++) {
//       const turnaround = turnarounds[i];
//       if (turnaround.turnaround_days === turnaroundDay) {
//         return { turnaround, turnaround_idx: i };
//       }
//     } 
//   }

//   render() {
//     const {
//       turnaroundUpdatedAutomatically,
//       turnaroundOptions,
//       orderTurnaroundtime,
//       selectedPart,
//       noOrder
//     } = this.props;

//     const {
//       togglePopup,
//     } = this;

//     const { defaultOption, open } = this.state;
//     const selectedPartTurnaround = selectedPart ? turnaroundOptions[selectedPart.turnaround_idx] : null;

//     return (
//       <div style={{padding:'10px', paddingBottom:'5px', display:'flex'}}>
//       <div className="ship-date" style={{'flex':'1 1 auto', 'margin-left': '1px'}}>
//         <div className="plethora-calendar" style={{width:'-webkit-fill-available', zIndex:'0', paddingBottom:'3px',paddingTop:'3px'}}>
//           <div className="plethora-calendar__selected"
//             onClick={() => { if (this.props.turnarounds) togglePopup(); }}>
//             {
//               // make default order turnaround_time or default option or first in array or no option
//               noOrder ?
//               get(selectedPartTurnaround, 'name') :
//               orderTurnaroundtime ? 
//               get(find(turnaroundOptions, t => t.turnaround_days >= orderTurnaroundtime), 'name') :
//               defaultOption ?
//                 defaultOption :
//                 turnaroundOptions[0] ?
//                 turnaroundOptions[0].turnaround_days :
//                 'No Options Available'
//             }
//             <img src={caret} style={{width:'13px'}}/>
//             {turnaroundUpdatedAutomatically && (
//               <span className="type-orange asterisk-warning">*</span>
//             )}
//           </div>
//           {open && (
//             <span>
//               {this.renderDropdown()}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//     );
//   }
// }

// function mapStateToProps(state, ownProps) {
//   const order = get(ownProps, 'order');
//   const selectedTurnaround = get(ownProps, 'selectedTurnaround');
//   let turnarounds = get(state, 'pages.orderDetail.turnarounds.data', []);
//   let schedule = order ? buildSchedule(turnarounds, order) : null;
//   const orderTurnaroundtime = get(order, 'detail.turnaround_time');

//   const selectedPart = getSelectedPart(state);
//   let quantity;
//   if (selectedPart) {
//     quantity = selectedPart.quantity
//   } else {
//     quantity = get(state, 'pages.orderDetail.order.data.parts[0]._pivot_quantity')
//   }
//   if (ownProps.noOrder) {

//     schedule = compact(selectedPart.ship_dates.map(ship => {
//       let price = find(ship.prices, { quantity });
//       if (!price) {
//         return;
//       }
//       price = Math.ceil(price.totalPrice).toFixed(0);
//       return {
//         id: ship.id,
//         text: '$' + price,
//         month: ship.month,
//         date: ship.date,
//         year: ship.year
//       }
//     }))

//     turnarounds = selectedPart.turnarounds
//   }

//   return {
//     ...ownProps,
//     eventTypes: ['click'],
//     state,
//     order,
//     schedule,
//     selectedPart,
//     quantity,
//     turnarounds,
//     orderTurnaroundtime,
//     selectedMoment: selectedTurnaround ?
//       getTurnaroundMoment(selectedTurnaround) :
//       null,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     selectShipDate,
//     setTurnaround,
//     requestTrackingEvent
//   }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(TurnaroundOptionsPicker));
