export const TOKEN_VAR = 'TOKEN';
export const TOKEN_FLAG = 'AUTH_ROUTE';

export enum Labels {
    Location = 'Zoleo/Location',
    Messages = 'Zoleo/Messages'
}

export const LabelsList = Object.values(Labels);

const literals = {
    tokenVar: TOKEN_VAR,
    tokenFlag: TOKEN_FLAG,
    labels: Labels
};
export default literals
