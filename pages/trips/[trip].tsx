import type { NextPage } from "next";
import { AppProps } from "../../common/types";
import {
  getLocations,
  getMessages,
  getTrips,
} from "../../common/serverFunctions";
import Main from "../../components/main";

const Trips: NextPage<AppProps> = ({
  tokenURL,
  locations,
  messages,
  trips,
  page,
}: AppProps) => {
  return (
    <Main
      page={page}
      tokenURL={tokenURL}
      locations={locations}
      messages={messages}
      trips={trips}
    />
  );
};

type Context = {
  query: {
    trip: string;
  };
};

export async function getServerSideProps(context: Context) {
  const { trip } = context.query;
  return {
    props: {
      page: trip.toUpperCase(),
      tokenURL: process.env.AUTH_ROUTE || null,
      locations: await getLocations(trip),
      messages: await getMessages(trip),
      trips: await getTrips(),
    },
  };
}

export default Trips;
