import React from 'react';
import ReactDom from 'react-dom';
import App from './App.jsx';
import Relay from 'react-relay';

ReactDom.render(<App />, document.getElementById('app'));

//tagged template strings
let titleCase = strings => strings.join().replace(/\b\w/g, match => match.toUpperCase());
console.log(titleCase`javascrip template strings are awesome!`);

console.log(Relay.QL`
	query Testing {
		links {
			title
		}
	}
`);

