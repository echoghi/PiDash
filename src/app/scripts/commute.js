import React from 'react';
import axios from 'axios';

class Commute extends React.Component {
    constructor() {
        super();

        this.state = {
            data     : [],
            distance : 0,
            duration : 0,
            loading  : true,
            error    : null
        };
    };

    _getData() {
        axios.get("http://localhost:3000/api/commute")
            .then(res => {
 
                let data     = res.data,
                    distance = data.routes[0].legs[0].distance.text,
                    duration = data.routes[0].legs[0].duration.text;

                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    data,
                    distance,
                    duration,
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

    _renderCommute() {

        if(this.state.error) {
            return this._renderError();
        }

        return (
            <div className="commute__container">
                <div className="commute__time">
                    <span className="commute__header">{this.state.duration}</span>
                    <span className="commute__subhead">to work</span>
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
        this._getData();
    }

    componentDidMount() {
        let timeUpdate = setInterval(() => {
            this._getData();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(timeUpdate);
    }

    render() {
        return (
            <div className="commute">
                 {this.state.loading ? this._renderLoading() : this._renderCommute()}
            </div>
        );
    }

};

export default Commute;