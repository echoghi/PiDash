import React from 'react';

class Clock extends React.Component {
    constructor() {
        super();

        this.state = {
            time    : "",
            day     : "",
            month   : "",
            year    : "",
            date    : "",
            loading : true,
            error   : null
        };
    };

    _getTime() {
        let currentDate     = new Date(),
            date            = currentDate.getDate(),
            time,
            day             = currentDate.getDay(),
            monthNum        = currentDate.getMonth(),
            year            = currentDate.getFullYear(),
            currentSec      = currentDate.getSeconds(),
            currentMillisec = currentDate.getMilliseconds(),
            currentMin      = currentDate.getMinutes(),
            currentHr       = currentDate.getHours(),
            months          = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
            days            = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

            let month = months[monthNum];
            day   = days[day];

        if (currentHr === 0) { //if midnight (00 hours) hour = 12
            currentHr = 12;
        } else if (currentHr >= 13) { //convert military hours at and over 1300 (1pm) to regular hours by subtracting 12. 
            currentHr -= 12;
        }

        if (currentMin < 10) {
            currentMin = "0" + currentMin;
        }


        if (currentDate.getHours() < 12) {
            time = currentHr + ':' + currentMin + " AM";
        } else {
            time = currentHr + ':' + currentMin + " PM";
        }

      this.setState({
                time,
                day,
                month,
                year,
                date,
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
                <div className="time">
                    {this.state.time}
                </div>
                <div className="time--ext">
                    {this.state.day} {this.state.month} {this.state.date}, {this.state.year}
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