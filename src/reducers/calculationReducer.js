import { combineReducers } from 'redux';
import { getAllData } from '../storage/StorageHelper'

const INITIAL_STATE = {
    homePrice: '',
    downPayment: '',
    rate: 0,
    term: 0,
    frequency: 'monthly',
    
    result: '',
    mortgageAmount: '',
    totalInterest: '',
    totalPayment: '',
    details: [],

    listings: [],
};

var LISTING_STATE = [];

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
