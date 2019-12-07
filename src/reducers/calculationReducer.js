import { combineReducers } from 'redux';
import { getAllData } from '../storage/StorageHelper'

const INITIAL_STATE = {};

const calculationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CALCULATE':
            const newState = action.payload;
            return newState;
        default:
            return state;
    }
};

export default combineReducers({
    values: calculationReducer,
});
