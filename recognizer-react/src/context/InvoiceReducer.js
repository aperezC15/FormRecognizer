import { SET_MODELID, SET_FIELDS, SET_FIELDTABLE } from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_MODELID:
			return {
				...state,
				modelId: action.payload
			};
		case SET_FIELDS:
			return {
				...state,
				fields: action.payload
			};
		case SET_FIELDTABLE:
			return {
				...state,
				resultado: action.payload
			};
		default:
			return state;
	}
};
