import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
	static propTypes = {};
	static defaultProps = {};

	render() {
		const content = this.props.store.links.map(link => {
			//TODO: Make li a <Link />
			return (
				<li key={link._id}>
					<a href={link.url}>{link.title}</a>
				</li>
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
				links {
					_id,
					title,
					url
				}
			}
		`
	}
});

export default App;