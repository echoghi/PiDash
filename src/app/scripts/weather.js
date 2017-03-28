import React from 'react';
import axios from 'axios';

class Weather extends React.Component {
    constructor() {
        super();

        this.state = {
            data     : [],
            days     : [],
            loading  : true,
            error    : null,
        };

    }

    _getWeather() {
        
        // Remove the 'www.' to cause a CORS error (and see the error state)
        axios.get("http://api.openweathermap.org/data/2.5/forecast/daily?q=paloalto,us&APPID=1c3673cc09eb008cb08f2075c97393ae&cnt=6")
          .then(res => {
            // Transform the raw data by extracting the nested posts
            let data = res;
            let days = [];
            console.log(res)
            let dayNames = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
            let d    = new Date;
            let n    = d.getDay();
            let forecastDays = [];

            data.data.list.map((day, index) => {

                days[index] = { day : "",
                                img : `http://openweathermap.org/img/w/${day.weather[0].icon}.png`, 
                                min : Math.floor(day.temp.min * 9 / 5 - 459.67),
                                max : Math.floor(day.temp.max * 9 / 5 - 459.67)  
                              };

            })

            // Populate Forecast Scope
            for(let i = 1; i < 6; i++) {
                forecastDays[0] = dayNames[n];
                forecastDays[i] = dayNames[n + i];
            }

            forecastDays.map((day, index) => {
                days[index].day = day;
            });

            let currentTemp = Math.floor(data.data.list[0].temp.day * 9 / 5 - 459.67) + "°F";

            // Update state to trigger a re-render.
            // Clear any errors, and turn off the loading indiciator.
            this.setState({
                data,
                days,
                currentTemp,
                loading : false,
                error   : null
            });
        })
        .catch(err => {
            // Something went wrong. Save the error in state and re-render.
            this.setState({
                loading : false,
                error   : err
            });
        });

    }

    _forecast() {
        if(this.state.error) {
            return this._renderError();
        }

        return (
            <div className="forecast">
                <span className="weather-title">
                    {this.state.data.data.city.name}, {this.state.data.data.city.country}
                </span>
                <span className="weather-subhead"> 
                    {this.state.data.data.list[0].weather[0].description} with a high of {this.state.days[0].max} and a low of {this.state.days[0].min}
                </span>
                <div className="forecast-lower">
                    {this.state.days.map(day =>
                    <div key={day.day}>    
                        {day.day}
                        <img src={day.img} />
                        <div className="day row">
                            <span className="min">{day.min}</span>
                            <span className="max">{day.max}</span>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        );
    }

    _renderLoading() {
        return <div>Loading...</div>;
    }

    _renderError() {
        return (
            <div>
                Uh oh: {this.state.error.message}
            </div>
        );
    }

    componentWillMount() {
        this._getWeather();
    }

    componentDidMount() {
        this._getWeather();

        let weatherUpdate = setInterval(() => {
            this._getWeather();
        }, 120000);

    }

    componentWillUnmount() {
        clearInterval(weatherUpdate);
    }

    render() {
        return (
            <div className="weather">
                {this.state.loading ? this._renderLoading() : this._forecast()}
            </div>
        );
    }

};

export default Weather;