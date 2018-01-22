// @flow
import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import type {State} from "../redux/state";

type Props = {
    time: number
};

export const mapStateToProps = (state: State): Props => ({time: state.session.time});
export const TimerComponent = (props: Props): React$Element<any> => (
    <div id="clock-time" className="Clock">{formatTime(props.time)}</div>
);

// Untested
export default connect(mapStateToProps)(TimerComponent);

// Untested
TimerComponent.defaultProps = {
    displayName: 'Timer'
};

function formatTime(time: number): string {
    return moment(time).format(`mm[m] ss[s] SSS`);
}