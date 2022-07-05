import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./map";
import {  Location } from '@prisma/client'
import Marker from "./marker";

const render = (status: Status): JSX.Element => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <h3></h3>;
};

interface MapContainer {
  apiKey: string,
  locations: Location[]
}

const container: React.FC<MapContainer> = ({ apiKey, locations }) => {
  const center = { lat: 39.751731872558594, lng: -104.97377014160156 } as google.maps.LatLngLiteral;
  const zoom = 7;

  return (
      <Wrapper apiKey={apiKey} render={render}>
        <Map center={center} zoom={zoom}>
          {locations.map((location) => 
            <Marker 
              key={location.id}
              position={{ lat: Number(location.latitude), lng: Number(location.longitude)} as google.maps.LatLngLiteral}
            />
          )}
        </Map>
      </Wrapper>
  );
};

export default container;
