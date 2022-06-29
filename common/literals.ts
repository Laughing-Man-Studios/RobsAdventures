export const TOKEN_PATH = 'token.json';
export const TOKEN_FLAG = 'AUTH_ROUTE';

export enum Labels {
    Location = 'Zoleo/Location',
    Messages = 'Zoleo/Messages'
}

export const LabelsList = Object.values(Labels);

const literals = {
    tokenPath: TOKEN_PATH,
    tokenFlag: TOKEN_FLAG,
    labels: Labels
};
export default literals
