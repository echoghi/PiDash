import React from 'react';

class Clock extends React.Component {
    constructor() {
        super();

        this.state = {
            time    : "",
            loading : true,
            error   : null
        };
    };

    _getTime() {
        let currentDate     = new Date(),
            time,
            icon,
            iconClass,
            currentSec      = currentDate.getSeconds(),
            currentMillisec = currentDate.getMilliseconds(),
            currentMin      = currentDate.getMinutes(),
            currentHr       = currentDate.getHours();

        if (currentHr === 0) { //if midnight (00 hours) hour = 12
            currentHr = 12;
        } else if (currentHr >= 13) { //convert military hours at and over 1300 (1pm) to regular hours by subtracting 12. 
            currentHr -= 12;
        }

        if (currentMin < 10) {
            currentMin = "0" + currentMin;
        }

        if (currentDate.getHours() > 18) {
            icon = "https://cdn3.iconfinder.com/data/icons/meteocons/512/moon-symbol-128.png";
            iconClass = "night";
        }

        if (currentDate.getHours() >= 18 || currentDate.getHours() <= 5) {
            icon = "https://cdn3.iconfinder.com/data/icons/meteocons/512/moon-symbol-128.png";
            iconClass = "night";
        } else {
            icon = "http://findicons.com/files/icons/2480/simplegreen_sustainable_business_icons_set/128/sun.png";
            iconClass = "day";
        }

        if (currentDate.getHours() < 12) {
            time = currentHr + ':' + currentMin + " AM";
        } else {
            time = currentHr + ':' + currentMin + " PM";
        }

      this.setState({
                time,
                icon,
                iconClass,
                loading : false,
                error   : null
            });
    }

    _renderTime() {
        if(this.state.error) {
            return this._renderError();
        }

        return (
            <div className="clock">
                <div className={this.state.iconClass}>
                    <img src={this.state.icon} />
                </div>
                <div className="time">
                    {this.state.time}
                </div>
            </div>
        );
    }

    _renderLoading() {
        return <div className="loading">Loading...</div>;
    }

    _renderError() {
        return (
            <div className="error">
                Uh oh: {this.state.error.message}
            </div>
        );
    }

    componentWillMount() {
        this._getTime();
    }

    componentDidMount() {
        let timeUpdate = setInterval(() => {
            this._getTime();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(timeUpdate);
    }

    render() {
        return (
            <div className="time">
                {this.state.loading ? this._renderLoading() : this._renderTime()}
            </div>
        );
    }

};

export default Clock;