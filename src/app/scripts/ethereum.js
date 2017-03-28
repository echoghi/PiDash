import React from 'react';
import axios from 'axios';

class Ethereum extends React.Component {
    constructor() {
        super();

        this.state = {
            data      : [],
            supply    : "",
            marketCap : "",
            price     : "",
            btc       : "",
            loading   : true,
            error     : null
        };
    };

    _getPrices() {
        axios.get("https://coinmarketcap-nexuist.rhcloud.com/api/eth")
            .then(res => {
                let data      = res.data;
                let supply    = (data.supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let marketCap = (data.market_cap.usd).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let price     = (data.price.usd).toFixed(2);
                let btc       = (data.price.btc);
                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    data,
                    supply,
                    marketCap,
                    price,
                    btc,
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

    _renderPrices() {
        let colorClass;

        if(this.state.error) {
            return this._renderError();
        }

        if(this.state.data.change < 0) {
            colorClass = "change negative";
        } else {
            colorClass = "change positive";
        }

        return (
            <div>
                <h4 className="ethereum-header">
                Ethereum Ticker
                </h4>
                <div className="percent">
                    <span className="price">${this.state.price}</span>
                    <span className={colorClass}>({this.state.data.change}%)</span>
                </div>
                <ul className="stats">
                    <li>Market Capitalization: ${this.state.marketCap}</li>
                    <li>Available Supply: {this.state.supply} ETH</li>
                    <li>ETH/BTC: {this.state.btc} BTC</li>
                    <li>Wallet Balance: {this.state.balance} ETH</li>
                </ul>
                <img className="eth" src="https://upload.wikimedia.org/wikipedia/commons/b/b7/ETHEREUM-YOUTUBE-PROFILE-PIC.png" />            
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
        this._getPrices();
    }

    componentDidMount() {
        let priceUpdate = setInterval(() => {
            this._getPrices();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(priceUpdate);
    }

    render() {
        return (
            <div className="ethereum">
                {this.state.loading ? this._renderLoading() : this._renderPrices()}
            </div>
        );
    }

};

export default Ethereum;