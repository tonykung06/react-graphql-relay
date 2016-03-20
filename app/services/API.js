import {get, post} from 'jquery';
import ServerActions from './../actions/ServerActions';

export default {
	fetchLinks() {
		post('/graphql', {
			query: `{
				links {
					_id,
					title,
					url
				}
			}`
		}).done(response => {
			ServerActions.receiveLinks(response.data.links);
		});
	},
	fetchLinksRest() {
		get('/data/links').done(response => {
			ServerActions.receiveLinks(response);
		});
	}
};