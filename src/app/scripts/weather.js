import React from 'react';
import axios from 'axios';
import callApi from './apiUtils';
import Skycons from 'react-skycons';

class Weather extends React.Component {
    constructor() {
        super();

        this.state = {
            data     : [],
            city     : "",
            state    : "",
            lat      : 0,
            long     : 0,
            temp     : 0,
            icon     : "",
            loading  : true,
            error    : null
        };

        this._onSuccess = this._onSuccess.bind(this);
        this._onFailure = this._onFailure.bind(this);

    }

    _onSuccess(res) {
        let data     = res,
            hourly   = [],
            temp     = Math.round(res.currently.apparentTemperature) + '°',
            icon     = res.currently.icon,
            humidity = Math.round(res.currently.humidity * 10) + '%',
            wind     = Math.round(res.currently.windSpeed * 2.23694) +' MPH';
            // Get hourly forecast
            for(var i = 1; i < 4; i++) {
                hourly[i] = {
                    time : new Date(1000 * res.hourly.data[i].time).getHours(),
                    temp : Math.round(res.hourly.data[i].temperature) + '°',
                    icon : res.hourly.data[i].icon
                };

                switch (hourly[i].icon) {
                    case "clear-day":
                        hourly[i].icon = "CLEAR_DAY";
                        break;
                    case "clear-night":
                        hourly[i].icon = "CLEAR_NIGHT"; 
                        break;
                    case "partly-cloudy-day":
                        hourly[i].icon = "PARTLY_CLOUDY_DAY"; 
                        break;
                    case "partly-cloudy-night":
                        hourly[i].icon = "PARTLY_CLOUDY_NIGHT"; 
                        break;
                    case "cloudy":
                        hourly[i].icon = "CLOUDY"; 
                        break;
                    case "rain":
                        hourly[i].icon = "RAIN"; 
                        break;
                    case "sleet":
                        hourly[i].icon = "SLEET"; 
                        break;
                    case "snow":
                        hourly[i].icon = "SNOW"; 
                        break;
                    case "wind":
                        hourly[i].icon = "WIND"; 
                        break;
                    case "fog":
                        hourly[i].icon = "FOG"; 
                        break;
                    default :
                        hourly[i].icon = "CLEAR_DAY";
                        break;  
                }
                // format time
                if (hourly[i].time === 0) { 
                    hourly[i].time = 12;
                } else if (hourly[i].time >= 13) { 
                    hourly[i].time -= 12;
                }
                // Append AM or PM to forecast times
                hourly[i].time < 12 ? (hourly[i].time = hourly[i].time + " AM") : (hourly[i].time = hourly[i].time + " PM");
            }
            console.log(res)
        // Validate icon strings    
        switch (icon) {
            case "clear-day":
                icon = "CLEAR_DAY";
                break;
            case "clear-night":
                icon = "CLEAR_NIGHT"; 
                break;
            case "partly-cloudy-day":
                icon = "PARTLY_CLOUDY_DAY"; 
                break;
            case "partly-cloudy-night":
                icon = "PARTLY_CLOUDY_NIGHT"; 
                break;
            case "cloudy":
                icon = "CLOUDY"; 
                break;
            case "rain":
                icon = "RAIN"; 
                break;
            case "sleet":
                icon = "SLEET"; 
                break;
            case "snow":
                icon = "SNOW"; 
                break;
            case "wind":
                icon = "WIND"; 
                break;
            case "fog":
                icon = "FOG"; 
                break;
            default :
                icon = "CLEAR_DAY";
                break;  
        }
        // Update state to trigger a re-render.
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
            data,
            temp,
            icon,
            humidity,
            wind,
            hourly,
            loading : false,
            error   : null
        });
    }

    _onFailure(error) {
        let err = error;
        this.setState({
            loading : false,
            error   : err
        });
    }

    _getWeather() {
        axios.get("http://api.ipinfodb.com/v3/ip-city/?key=86be52d35c2a9476eae382805a6161756a0b2fd47514dcb31121e889bf4c53b5&format=json")
          .then(res => {
            let lat   = res.data.latitude,
                long  = res.data.longitude,
                city  = res.data.cityName,
                state = res.data.regionName;

            // Update state to trigger a re-render.
            // Clear any errors, and turn off the loading indiciator.
            this.setState({
                lat,
                long,
                city,
                state
            }, function(){
                const url = `http://localhost:3000/api/darksky?latitude=${this.state.lat}&longitude=${this.state.long}`;
                callApi(url, null, this._onSuccess, this._onFailure);
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
            <div className="weather__container">
                <div className="forecast">
                    <div className="forecast__header">
                        {this.state.city}, {this.state.state}
                    </div>
                    <div className="forecast__icon">
                        <Skycons color='white' icon={this.state.icon} autoplay={true} />
                    </div>
                    <div className="forecast__temp">
                        {this.state.temp}
                    </div>
                </div>
                <div className="weather__stats">
                    <ul className="weather__stats--list">
                        <li>
                            <span className="list--left" >Humidity</span>
                            <span className="list--right" >{this.state.humidity} </span>
                        </li>
                        <li>
                            <span className="list--left">Wind</span>
                            <span className="list--right">{this.state.wind}</span>
                        </li>
                    </ul>
                    <div className="weather__stats--forecast">
                        {this.state.hourly.map(hour =>
                            <div className="weather__stats--forecast-hour">
                                <span className="hour">{hour.time}</span>
                                <span className="icon">
                                    <Skycons color='white' icon={hour.icon} autoplay={true} />
                                </span>
                                <span className="temp">{hour.temp}</span>
                            </div>
                        )}
                    </div>
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
        this._getWeather();
    }

    componentDidMount() {
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
                {this.state.loading ? this._renderLoading() : this._forecast() }
            </div>
        );
    }

};

export default Weather;