import type { NextPage } from 'next';
import { AppProps } from '../common/types';
import { getLocations, getMessages, getTrips } from '../common/serverFunctions';
import Main from '../components/main';
import { DEFAULT_TRIP } from '../common/literals';


const Home: NextPage<AppProps> = ({
  tokenURL, locations, messages, trips, page
}: AppProps) => {
  return (<Main
    page={page}
    tokenURL={tokenURL}
    locations={locations}
    messages={messages}
    trips={trips}
  />);
};


export async function getServerSideProps() {
  return {
    props: {
      page: DEFAULT_TRIP,
      tokenURL: process.env.AUTH_ROUTE || null,
      locations: await getLocations(DEFAULT_TRIP),
      messages: await getMessages(DEFAULT_TRIP),
      trips: await getTrips()
    }
  };
}

export default Home;
