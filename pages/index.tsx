import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import GoogleMap from '../components/map/container'
import { PrismaClient, Location } from '@prisma/client'
import { CURRENT_TRIP } from '../common/literals'
import { ModifiedLocation } from '../common/types'

const prisma = new PrismaClient(); 

type Props = {
  tokenURL: String | null,
  apiKey: string,
  locations: ModifiedLocation[]
}

const Home: NextPage<Props> = ({ tokenURL, apiKey, locations }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rob's Adventures</title>
        <meta name="description" content="A website that tracks Rob on his hiking adventures" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Rob's Adventures!
        </h1>

        <p className={styles.description}>
          This site is a place for me to host my pictures and journal entries as well as post my locations while I am on my long distance hiking trips.
          I will be updating my location using my satellite communicator every 2 hours. Each marker on the map indicates a location emission. You can 
          also read my updates from the trail which I will try to post at least once a day. Enjoy! 
        </p>

        <GoogleMap apiKey={apiKey} locations={locations}></GoogleMap>
        
        <p>{tokenURL}</p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

async function getLocations(): ModifiedLocation {
  const locationData = await prisma.location.findMany({
    where: {
      trip: {
        name: CURRENT_TRIP
      }
    }
  });
  await prisma.$disconnect();

  return locationData.map((
    {id, gmailId, tripId, longitude, latitude, createdAt, updatedAt}
  ) => {
    return {
      id,
      gmailId,
      tripId,
      longitude,
      latitude,
      createdAt: createdAt.toString(),
      updatedAt: updatedAt.toString()
    }
  });
}

export async function getServerSideProps() {
  console.log('GETTING SERVERSIDE PROPS: tokenURL='+process.env.AUTH_ROUTE);
  
  return {
    props: {
      tokenURL:process.env.AUTH_ROUTE || null,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      locations: await getLocations()
    }
  };
}

export default Home
