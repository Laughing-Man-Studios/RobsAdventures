import type { NextPage } from 'next';
import { AppProps } from '../../common/types';
import { getLocations, getMessages, getTrips } from '../../common/serverFunctions';
import Main from '../../components/main';
import { DEFAULT_TRIP } from '../../common/literals';


const Trips: NextPage<AppProps> = ({ 
  tokenURL, apiKey, locations, messages, trips, page 
}: AppProps) => {
  return (<Main
    page={page}
    tokenURL={tokenURL}
    apiKey={apiKey}
    locations={locations}
    messages={messages}
    trips={trips}
  />);
};


export async function getServerSideProps(context: any) {
  const { trip } = context.query;
  return {
    props: {
      page: trip.toUpperCase(),
      tokenURL:process.env.AUTH_ROUTE || null,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      locations: await getLocations(trip || DEFAULT_TRIP),
      messages: await getMessages(trip || DEFAULT_TRIP),
      trips: await getTrips()
    }
  };
}

export default Trips;