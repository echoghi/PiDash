import React from 'react';
import axios from 'axios';

class News extends React.Component {
    constructor() {
        super();

        this.state = {
            data    : [],
            loading : true,
            error   : null
        };
    };

    _getNews() {
        axios.get("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1/.json?api-key=da100d8e23d3f94fc1ff6deefe9742ea:2:70699191")
            .then(res => {
                let data = res;
                console.log(res)
                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    data,
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

    _renderNews() {
        if(this.state.error) {
            return this._renderError();
        }

        return (
            <div className="news">
                <h4 id="news-header">
                    Top Stories from the NY Times
                </h4>
                {this.state.data.results.map(headlines => 
                    <div className="stories">
                        <img className="story-img" src={headlines.media[0]["media-metadata"][0].url} /> 
                        {headlines.title}
                        <span className="details">{headlines.abstract} </span>
                    </div>
                )}
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
        this._getNews();
    }

    componentDidMount() {
        this._getNews();

        let newsUpdate = setInterval(() => {
            this._getNews();
        }, 120000);
    }

    componentWillUnmount() {
        clearInterval(newsUpdate);
    }

    render() {
        return (
            <div className="news">
                {this.state.loading ? this._renderLoading() : this._renderNews()}
            </div>
        );
    }

};

export default News;