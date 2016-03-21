import Relay from 'react-relay';

export default class CreateLinkMutation extends Relay.Mutation {
	getMutation() {
		return Relay.QL`
			mutation {
				createLink
			}
		`;
	}

	getVariables() {
		return {
			title: this.props.title,
			url: this.props.url
		};
	}

	getFatQuery() {
		return Relay.QL`
			fragment on CreateLinkPayload {
				linkEdge,
				store {
					linkConnection
				}
			}
		`;
	}

	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'store',
			parentID: this.props.store.id,
			connectionName: 'linkConnection',
			edgeName: 'linkEdge',
			rangeBehaviors: {
				// When the ships connection is not under the influence
				// of any call, append the ship to the end of the connection
				'': 'append'
			}
		}];
	}
};