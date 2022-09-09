export const GMAIL_TOKEN_VAR = 'GMAIL_TOKEN';
export const GMAIL_TOKEN_FLAG = 'AUTH_ROUTE';
export const DEFAULT_TRIP = 'JOHN_MUIR_TRAIL';
export const GET_MAIL_RUN_DATE = 'GET_MAIL_RUN_DATE';
export const GET_MAIL_INTERVAL = 21600000;

export enum Labels {
  Location = 'Zoleo/Location',
  Messages = 'Zoleo/Messages'
}

export const LabelsList = Object.values(Labels);

export const TRIP_META_DATA = [
  {
    name: 'RITO_ALTO_FOUR_PASS_LOOP',
    zoom: 3,
    lng: 0,
    lat: 0
  },
  {
    name: 'JOHN_MUIR_TRAIL',
    zoom: 8,
    lng: -118.86505,
    lat: 37.090345
  },
  {
    name: 'WOODLAND_LAKE',
    zoom: 14,
    lng: -105.63268,
    lat: 39.96284
  }
]

const literals = {
  tokenVar: GMAIL_TOKEN_VAR,
  tokenFlag: GMAIL_TOKEN_FLAG,
  labels: Labels,
  defaultTrip: DEFAULT_TRIP,
  tripMetaData: TRIP_META_DATA
};
export default literals
