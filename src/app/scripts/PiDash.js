import React from 'react';
// Components
import Weather from './weather';
import Commute from './commute';
import Clock from './clock';
import Ethereum from './ethereum';
import News from './news';
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
				<Commute />
				<News />
				<Ethereum />
				<Clock />
			</div>
		);
	}

};

export default PiDash;