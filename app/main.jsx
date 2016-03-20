import React from 'react';
import ReactDom from 'react-dom';
import App from './App.jsx';
import Relay from 'react-relay';

class HomeRoute extends Relay.Route {
	static routeName = 'Home';
	static queries = {
		store: (Component) => Relay.QL`
			query AppQuery {
				store {
					${Component.getFragment('store')}
				}
			}
		`
	};
}

ReactDom.render(
	<Relay.RootContainer
		Component={App}
		route={new HomeRoute()}
	 />,
	document.getElementById('app')
);

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

