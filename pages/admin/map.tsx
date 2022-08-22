import { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import sessionOptions from '../../common/session';
import AdminMain from '../../components/admin/main';
import { toTitleCase } from '../../common/functions';
import { Trip } from '@prisma/client';
import { getTrips } from '../../common/serverFunctions';
import { ChangeEvent, createRef, useState } from 'react';
import styles from '../../styles/Admin.module.css';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import Map from '../../components/map/map';

interface AdminMapProps {
    trips: Trip[];
    apiKey: string;
}

const AdminMap: NextPage<AdminMapProps> = ({ trips, apiKey }: AdminMapProps) => {
    const select = createRef<HTMLSelectElement>();
    const [trip, setTrip] = useState(trips[0].name);
    const [lat, setLat] = useState(trips[0].lat);
    const [lng, setLng] = useState(trips[0].lng);
    const [zoom, setZoom] = useState(trips[0].zoom);
    function updateTrip(e: ChangeEvent<HTMLSelectElement>) {
        const currTrip = e.target.value || trips[0].name;
        setTrip(currTrip);
        const selTrip = trips.find(tripObj => tripObj.name === currTrip);
        if (selTrip) {
            setLat(selTrip.lat);
            setLng(selTrip.lng);
            setZoom(selTrip.zoom);
        }
    }

    function onPan(newLat: number, newLng: number) {
        setLat(newLat);
        setLng(newLng);
    }

    function onZoom(newZoom: number) {
        setZoom(newZoom);
    }

    const render = (status: Status): JSX.Element => {
        if (status === Status.LOADING) return <h3>{status} ..</h3>;
        if (status === Status.FAILURE) return <h3>{status} ...</h3>;
        return <h3></h3>;
    };

    return (
        <AdminMain title='Admin Map Editor'>
            <Wrapper apiKey={apiKey} render={render}>
                <Map key={trip} center={{ lat, lng }} zoom={zoom} onPan={onPan} onZoom={onZoom}/>
            </Wrapper>
            <form className={styles.mapForm} action='/api/admin/map' method='post'>
                <label htmlFor='trips'>Trip</label>
                <select 
                    className={styles.mapPadding} 
                    name='trips' value={trip} 
                    onChange={updateTrip}>
                    { trips.map(trip => {
                        return (
                            <option key={trip.name} value={trip.name}>
                                { toTitleCase(trip.name.replaceAll('_',' ')) }
                            </option>
                        );
                    })}
                </select>
                <label htmlFor='lng'>Longitude</label>
                <input 
                    className={styles.mapPadding} 
                    name='lng' 
                    type='number' 
                    value={lng}
                    onChange={({ target }) => setLng(Number(target.value))}/>
                <label htmlFor='lat'>Latitude</label>
                <input 
                    className={styles.mapPadding} 
                    name='lat' 
                    type='number' 
                    value={lat}
                    onChange={({ target }) => setLat(Number(target.value))}/>
                <label htmlFor='zoom'>Zoom</label>
                <input 
                    className={styles.mapPadding} 
                    name='zoom' 
                    type='number' 
                    value={zoom}
                    onChange={({ target }) => setZoom(Number(target.value))}/>
                <button type='submit'>Save</button>
            </form>
        </AdminMain>
    );
};

export const getServerSideProps = withIronSessionSsr(
   async function({ req, res }) {
    if (!req.session.loggedIn) {
        res.statusCode = 401;
        res.end();
    }
    return {
        props: {
            trips: await getTrips(),
            apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
        }
    };
   }, sessionOptions
);

export default AdminMap;