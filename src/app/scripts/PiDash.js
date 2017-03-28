import React from 'react';
// Components
import Weather from './weather';
import Clock from './clock';
import Ethereum from './ethereum';
import News from './news';
import Reddit from './reddit';
// SCSS
import styles from '../stylesheets/style.scss';

class PiDash extends React.Component {
	constructor() {
		super();

		this.state = {
			posts   : [],
      		loading : true,
      		error   : null
		}
	}

	render() {
		return (
			<div className="dashboard">
				<Weather />
				<Reddit />
				<Ethereum />
				<Clock />
			</div>
		);
	}

};

export default PiDash;