import React from 'react';
import Relay from 'react-relay';
import Link from './components/Link.jsx';

class App extends React.Component {
	static propTypes = {};
	static defaultProps = {};
	setLimit = (e) => {
		const newLimit = Number(e.target.value);

		this.props.relay.setVariables({
			limit: newLimit
		});
	};
	render() {
		const content = this.props.store.linkConnection.edges.map(edge => {
			return (
				<Link key={edge.node.id} link={edge.node} />
			);
		});

		return (
			<div>
				<h3>Links</h3>
				<select onChange={this.setLimit} defaultValue="5">
					<option value="3">3</option>
					<option value="5">5</option>
				</select>
				<ul>
					{content}
				</ul>
			</div>
		);
	}
};

//declare the data requirement for this component
App = Relay.createContainer(App, {
	initialVariables: {
		limit: 5
	},
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				linkConnection(first: $limit) {
					edges {
						node {
							id,
							${Link.getFragment('link')}
						}
					}
				}
			}
		`
	}
});

export default App;