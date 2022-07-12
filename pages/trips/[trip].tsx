import type { NextPage } from 'next'
import { AppProps } from '../../common/types'
import { getLocations, getMessages, getTrips } from '../../common/functions'
import Main from '../../components/main'


const Trips: NextPage<AppProps> = ({ tokenURL, apiKey, locations, messages, trips }) => {
  return (<Main 
    tokenURL={tokenURL}
    apiKey={apiKey}
    locations={locations}
    messages={messages}
    trips={trips}
  />)
}


export async function getServerSideProps() {
  return {
    props: {
      tokenURL:process.env.AUTH_ROUTE || null,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      locations: await getLocations(),
      messages: await getMessages(),
      trips: await getTrips()
    }
  };
}

export default Trips;