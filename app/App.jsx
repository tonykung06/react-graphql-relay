import React from 'react';
import Relay from 'react-relay';
import Link from './components/Link.jsx';
import CreateLinkMutation from './mutations/CreateLinkMutation';

class App extends React.Component {
	static propTypes = {};
	static defaultProps = {};
	setLimit = (e) => {
		const newLimit = Number(e.target.value);

		this.props.relay.setVariables({
			limit: newLimit
		});
	};
	handleSubmit = (e) => {
		e.preventDefault();

		Relay.Store.commitUpdate(
			new CreateLinkMutation({
				title: this.refs.newTitle.value,
				url: this.refs.newUrl.value,
				store: this.props.store
			})
		);

		this.refs.newTitle.value = '';
		this.refs.newUrl.value = '';
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
				<form onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Title" ref="newTitle" />
					<input type="text" placeholder="Url" ref="newUrl" />
					<button type="submit">Add</button>
				</form>

				Showing: &nbsp;
				<select onChange={this.setLimit} defaultValue={this.props.relay.variables.limit}>
					<option value="3">3</option>
					<option value="200">200</option>
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
		limit: 200
	},
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				id,
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