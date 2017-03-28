import React from 'react';
import axios from 'axios';

class Reddit extends React.Component {
    constructor() {
        super();

        this.state = {
            data    : [],
            photo   : "",
            title   : "",
            loading : true,
            error   : null
        };
    };

    _getPost() {
        axios.get("https://www.reddit.com/r/earthporn/.json")
          .then(res => {
            let data = res;
            let photo;
            let title;
            console.log(data.data.data.children[1].data.title)
            photo = data.data.data.children[1].data.preview.images[0].source.url;
            title = data.data.data.children[1].data.title;


            // Update state to trigger a re-render.
            // Clear any errors, and turn off the loading indiciator.
            this.setState({
                data,
                photo,
                title,
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

    _renderPost() {
        if(this.state.error) {
            return this._renderError();
        }

        return (
            <div className="reddit-container">
                <img src={this.state.photo} />
                    <div className="reddit-subhead">
                        <span className="reddit-title"> {this.state.title} </span>
                        <span className="reddit-photo"> Photos by r/{this.state.data.data.data.children[0].data.subreddit} </span>
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
        this._getPost();
    }

    componentDidMount() {
        this._getPost();

        let redditUpdate = setInterval(() => {
            this._getPost();
        }, 120000);
    }

    componentWillUnmount() {
        clearInterval(redditUpdate);
    }

    render() {
        return (
            <div className="reddit">
                {this.state.loading ? this._renderLoading() : this._renderPost()}
            </div>
        );
    }

};

export default Reddit;