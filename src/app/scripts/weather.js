import React from 'react';
import axios from 'axios';

class Weather extends React.Component {
    constructor() {
        super();

        this.state = {
            data   : [],
            forecast : {},
            loading : true,
            error   : null,
        };

    }

    _getWeather() {
        // Remove the 'www.' to cause a CORS error (and see the error state)
        axios.get("http://api.openweathermap.org/data/2.5/forecast/daily?q=paloalto,us&APPID=1c3673cc09eb008cb08f2075c97393ae&cnt=6")
          .then(res => {
            // Transform the raw data by extracting the nested posts
            const data = res;
            const forecast = {
                min : [],
                max : [],
                currentTemp : 0
            };


            data.list.map((temp, index) => {
                forecast.min[index] = Math.floor(temp[index].temp.min * 9 / 5 - 459.67);
                forecast.max[index] = Math.floor(temp[index].temp.max * 9 / 5 - 459.67);
            })
        
            forecast.currentTemp = Math.floor(temp[0].temp.day * 9 / 5 - 459.67) + "°F";

            // Update state to trigger a re-render.
            // Clear any errors, and turn off the loading indiciator.
            this.setState({
                data,
                forecast,
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

    componentWillMount() {
        this._getWeather();
    }

    componentDidMount() {
        // Get the Day
        let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
        let d = new Date;
        let n = d.getDay();
        let forecastDays = [];
    
        // Populate Forecast Scope
        for(let day = 1; day < 6; day++){
            forecastDays[0] = days[n];
            forecastDays[day] = days[n + day];
        }

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

        </div>
      );
    }

};

export default Weather;