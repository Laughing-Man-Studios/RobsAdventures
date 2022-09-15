import { AppProps } from '../common/types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import GoogleMap from '../components/map/container';
import TimeTable from '../components/table';
import Blog from '../components/blog';
import MobileNav from './nav/mobile';
import WebNav from './nav/web';
import { Trip } from '@prisma/client';
import Pictures from './pictures';

const Main: React.FC<AppProps> = ({ tokenURL, apiKey, locations, messages, trips, page, pictures }) => {
    const selectedTrip = trips.find(trip => trip.name === page.toUpperCase()) || {} as Trip;

    return (
        <div className={styles.container}>
          {
            tokenURL && (<p className={styles.authenticate}>Please Authenticate Application Via The Admin Portal</p>)
          }
          <Head>
            <title>Robs Adventures</title>
            <meta name="description" content="A website that tracks Rob on his hiking adventures" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <MobileNav trips={trips} page={page} />
          <WebNav trips={trips} page={page} />
          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to Robs Adventures!
            </h1>
    
            <p className={styles.description}>
              This site is a place for me to host my pictures and journal entries as well as post my locations while I am on my long distance hiking trips.
              I will be updating my location using my satellite communicator a few times a day. Each marker on the map indicates a location emission. You can 
              also read my updates from the trail which I will try to post at least once a day. Enjoy! 
            </p>
            <div id='map-section' className={styles.section}>
              <h2 className={styles.sectionHeader}>Map</h2>
              <p>
                This shows all of the different points on my trip where I triggered my satellite locator. 
                Each numbered point on the map corrisponds with the same number in the table to the right of the map. 
                The table shows the time at which location was triggered by me.
              </p>
              <div className={styles.mapContent}>
                <GoogleMap apiKey={apiKey} locations={locations} mapCoords={selectedTrip} page={page}/>
                <TimeTable locations={locations} />
              </div>
            </div>
            { messages.length > 0 ?
              (<div id='blog-section' className={styles.section}>
                <h2 className={styles.sectionHeader}>Blog</h2>
                <p>
                  This is a small blog where I will be posting updates from my trip. I will try to write something out each day.
                  Since my satellite communicator has a limit of a little over a 200 characters, my messages will probably be pretty brief.
                </p>
                <Blog messages={messages} />
              </div>) : null
            }
            { pictures.length > 0 ?
              (<div id='picture-section' className={styles.section}>
                <h2 className={styles.sectionHeader}>Pictures</h2>
                <p>
                  This is a collection of pictures I have taken while I was on my trip. They are hosted in google photos and you 
                  can see them there by clicking on the link below.
                </p>
                <Pictures pictures={pictures} link={selectedTrip.photosUrl || ''} />
              </div>) : null
            }
          </main>
    
          <div className={styles.adminLinkContainer}>
            <Link href='/admin/login'>
              <a className={styles.adminLink}>Admin Login</a>
            </Link>
          </div>

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

export default Main;