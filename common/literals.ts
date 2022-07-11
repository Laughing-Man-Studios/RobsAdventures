export const GMAIL_TOKEN_VAR = 'GMAIL_TOKEN';
export const GMAIL_TOKEN_FLAG = 'AUTH_ROUTE';
export const CURRENT_TRIP = 'WOODLAND_LAKE';

export enum Labels {
    Location = 'Zoleo/Location',
    Messages = 'Zoleo/Messages'
}

export const LabelsList = Object.values(Labels);

const literals = {
    tokenVar: GMAIL_TOKEN_VAR,
    tokenFlag: GMAIL_TOKEN_FLAG,
    labels: Labels,
    currentTrip: CURRENT_TRIP
};
export default literals
