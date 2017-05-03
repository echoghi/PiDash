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
        let data = res,
            temp = Math.round(res.currently.apparentTemperature) + '°',
            icon = res.currently.icon;

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
                const url = `http://localhost:8080/api/darksky?latitude=${this.state.lat}&longitude=${this.state.long}`;
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
                {this.state.loading ? this._renderLoading() : this._forecast()}
            </div>
        );
    }

};

export default Weather;