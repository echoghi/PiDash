import React from 'react';
import axios from 'axios';

class Ethereum extends React.Component {
    constructor() {
        super();

        this.state = {
            data      : [],
            supply    : "",
            marketCap : "",
            symbol    : "",
            price     : "",
            btc       : "",
            loading   : true,
            error     : null
        };
    };

    _getPrices() {
        axios.get("http://localhost:3000/api/crypto?coin=ethereum")
            .then(res => {
 
                let data      = res.data[0],
                    supply    = (data.total_supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    marketCap = parseInt(data.market_cap_usd).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    symbol    = data.symbol,
                    price     = parseInt(data.price_usd).toFixed(2),
                    btc       = parseFloat(data.price_btc);
                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    data,
                    supply,
                    marketCap,
                    symbol,
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
        if(parseFloat(this.state.data.percent_change_24h) < 0) {
            colorClass = "change negative";
        } else {
            colorClass = "change positive";
        }

        return (
            <div>
                <h4 className="ethereum-header">
                {this.state.data.name}
                </h4>
                <div className="percent">
                    <span className="price">${this.state.price}</span>
                    <span className={colorClass}>({parseFloat(this.state.data.percent_change_24h)}%)</span>
                </div>
                <ul className="stats">
                    <li>
                        <span>Market Cap.</span>
                        <span>${this.state.marketCap}</span>
                    </li>
                    <li>
                        <span>Supply</span>
                        <span>{this.state.supply} {this.state.symbol}</span>
                    </li>
                    <li>
                        <span>{this.state.symbol}/BTC</span>
                        <span>{this.state.btc} BTC </span>
                    </li>
                </ul>            
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