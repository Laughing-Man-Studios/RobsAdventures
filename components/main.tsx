import { AppProps } from "../common/types";
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import GoogleMap from '../components/map/container'
import TimeTable from '../components/table'
import Blog from '../components/blog'
import { Trip } from "@prisma/client";

const Main: React.FC<AppProps> = ({ tokenURL, apiKey, locations, messages, trips, page }) => {
    const mapCoords = trips.find(trip => trip.name === page.toUpperCase()) || {} as Trip;
    return (
        <div className={styles.container}>
          <Head>
            <title>Robs Adventures</title>
            <meta name="description" content="A website that tracks Rob on his hiking adventures" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <nav className={styles.nav}>
            <span className={styles.navLabel}>Navigation</span>
            { trips.map(({ name }) => {
              const href = name.toLowerCase();
              const display = name.split('_').map(substr => {
                const str = substr.toLowerCase();
                return str.charAt(0).toUpperCase() + str.slice(1);
              }).join(' ');
              return (
                <div key={name} className={styles.linkContainer}>
                  { name === page && <div className={styles.rightEqui}/>}        
                  <Link href={`/trips/${href}`}>
                    <a>{display}</a>
                  </Link>
                </div>
              );
            }) }
          </nav>
          <nav className={styles.mobileNav}>
            Mobile Nav
          </nav>
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
                <GoogleMap apiKey={apiKey} locations={locations} mapCoords={mapCoords} page={page}/>
                <TimeTable locations={locations} />
              </div>
            </div>
            <div id='blog-section' className={styles.section}>
              <h2 className={styles.sectionHeader}>Blog</h2>
              <p>
                This is a small blog where I will be posting updates from my trip. I will try to write something out each day.
                Since my satellite communicator has a limit of a little over a 200 characters, my messages will probably be pretty brief.
              </p>
              <Blog messages={messages} />
            </div>
    
            
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

export default Main;