import React from 'react';
import API from './services/API';
import LinkStore from './stores/LinkStore';

const _getAppState = () => {
	return {
		links: LinkStore.getAll()
	}
};

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.state = _getAppState();
	}

	onChange() {
		this.setState(_getAppState());
	}

	componentWillMount() {
		LinkStore.removeListener('change', this.onChange);
	}

	componentDidMount() {
		API.fetchLinks();

		LinkStore.on('change', this.onChange);
	}

	render() {
		const content = this.state.links.map(link => {
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