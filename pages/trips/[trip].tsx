import type { NextPage } from 'next'
import { AppProps } from '../../common/types'
import { getLocations, getMessages, getTrips } from '../../common/functions'
import Main from '../../components/main'
import { CURRENT_TRIP } from '../../common/literals'


const Trips: NextPage<AppProps> = ({ tokenURL, apiKey, locations, messages, trips, page }) => {
  return (<Main
    page={page}
    tokenURL={tokenURL}
    apiKey={apiKey}
    locations={locations}
    messages={messages}
    trips={trips}
  />)
}


export async function getServerSideProps(context: any) {
  const { trip } = context.query;
  return {
    props: {
      page: trip.toUpperCase(),
      tokenURL:process.env.AUTH_ROUTE || null,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      locations: await getLocations(trip || CURRENT_TRIP),
      messages: await getMessages(trip || CURRENT_TRIP),
      trips: await getTrips()
    }
  };
}

export default Trips;