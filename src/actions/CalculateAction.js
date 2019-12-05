export const calculateValues = (state) => (
    {
        type: 'CALCULATE',
        payload: state,
    }
);

export const updateListings = (listing) => (
    {
        type: 'UPDATE',
        payload: listing,
    }
);