import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {LinearProgress} from "@material-ui/core";

const TICK_DELAY = 100;

class TimerProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        };
        this.interval = setInterval(() => {
            this.setState(prevState => ({time: prevState.time + TICK_DELAY}));
        }, TICK_DELAY);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        if (this.state.time > this.props.milliseconds + 500) {
            if (this.interval) {
                clearInterval(this.interval);
                this.props.onFinish();
            }
            return null;
        }

        return (
            <LinearProgress value={ 100 - (this.state.time / this.props.milliseconds * 100)} variant="determinate" />
        );
    }
}

TimerProgress.propTypes = {
    milliseconds: PropTypes.number.isRequired,
    onFinish: PropTypes.func,
};


export default TimerProgress;