import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./map";
import {  Trip } from '@prisma/client'
import Marker from "./marker";
import { ModifiedLocation } from "../../common/types";

const render = (status: Status): JSX.Element => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <h3></h3>;
};

interface MapContainer {
  apiKey: string,
  locations: ModifiedLocation[]
  mapCoords: Trip,
  page: string;
}

const container: React.FC<MapContainer> = ({ apiKey, locations, mapCoords, page }) => {
  const center = { lat: mapCoords.lat, lng: mapCoords.lng } as google.maps.LatLngLiteral;

  return (
      <Wrapper apiKey={apiKey} render={render}>
        <Map key={page} center={center} zoom={mapCoords.zoom}>
          {locations.map((location) => 
            <Marker 
              key={location.id}
              position={{ lat: Number(location.latitude), lng: Number(location.longitude)} as google.maps.LatLngLiteral}
              label={location.id.toString()}
            />
          )}
        </Map>
      </Wrapper>
  );
};

export default container;
