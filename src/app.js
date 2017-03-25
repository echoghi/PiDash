import React from 'react';
import ReactDOM from 'react-dom';

let _ = require('lodash');

import PiDash from './app/scripts/PiDash';

let AppComponent = ReactDOM.render(
	<PiDash />, 
	document.getElementById('main')
);
