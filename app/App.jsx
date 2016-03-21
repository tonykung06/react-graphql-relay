import React from 'react';
import Relay from 'react-relay';
import Link from './components/Link.jsx';

class App extends React.Component {
	static propTypes = {};
	static defaultProps = {};

	render() {
		const content = this.props.store.links.map(link => {
			return (
				<Link key={link._id} link={link} />
			);
		});

		return (
			<div>
				<h3>Links</h3>		
				<ul>
					{content}
				</ul>
			</div>
		);
	}
};

//declare the data requirement for this component
App = Relay.createContainer(App, {
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				#fetching 5 links only
				links {
					_id,
					${Link.getFragment('link')}
				}
			}
		`
	}
});

export default App;