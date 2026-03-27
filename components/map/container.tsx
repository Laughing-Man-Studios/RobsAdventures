import * as React from 'react';
import dynamic from 'next/dynamic';
import { Trip } from '@prisma/client';
import { ModifiedLocation } from '../../common/types';

const Map = dynamic(() => import('./map'), { ssr: false });
const Marker = dynamic(() => import('./marker'), { ssr: false });

interface MapContainer {
  locations: ModifiedLocation[];
  mapCoords: Trip | undefined;
  page: string;
}

const Container: React.FC<MapContainer> = ({ locations, mapCoords, page }) => {
  if (!mapCoords || mapCoords.lat == null || mapCoords.lng == null) {
    return <p>No map coordinates configured for this trip.</p>;
  }

  return (
    <Map key={page} center={{ lat: mapCoords.lat, lng: mapCoords.lng }} zoom={mapCoords.zoom}>
      {locations.map((location) =>
        <Marker
          key={location.id}
          position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
          label={location.id.toString()}
        />
      )}
    </Map>
  );
};

export default Container;
