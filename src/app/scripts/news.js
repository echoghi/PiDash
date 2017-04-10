import React from 'react';
import axios from 'axios';

class News extends React.Component {
    constructor() {
        super();

        this.state = {
            data    : [],
            news    : [],
            loading : true,
            error   : null
        };
    };

    _getNews() {
        axios.get("https://www.reddit.com/r/news/.json")
            .then(res => {
                let data = res,
                    news = [],
                    sub;
                    console.log(data)

                sub = data.data.data.children[0].data.subreddit;

                res.data.data.children.map((headline, index) => {
                    if(index < 10) {
                        news.push({
                            title : headline.data.title,
                            id    : headline.data.id
                        });
                    }
                });

                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    data,
                    news,
                    sub,
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
                <h3 className="news-header">
                    r/{this.state.sub}
                </h3>
                {this.state.news.map(headlines => 
                    <li className="stories" key={headlines.id}> 
                        {headlines.title}
                    </li>
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