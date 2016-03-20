import AppDispatcher from './../AppDispatcher';
import {ActionTypes} from './../Constants';

export default {
	receiveLinks(links) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_LINKS,
			links
		});
	}
};