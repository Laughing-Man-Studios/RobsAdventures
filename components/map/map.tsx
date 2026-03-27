import React, { PropsWithChildren } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import mapStyles from '../../styles/Map.module.css';

interface MapEventsProps {
  onPan?: (lat: number, lng: number) => void;
  onZoom?: (zoom: number) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onPan, onZoom }) => {
  useMapEvents({
    moveend(e) {
      if (onPan) {
        const center = e.target.getCenter();
        onPan(center.lat, center.lng);
      }
    },
    zoomend(e) {
      if (onZoom) {
        onZoom(e.target.getZoom());
      }
    },
  });
  return null;
};

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onPan?: (lat: number, lng: number) => void;
  onZoom?: (zoom: number) => void;
}

const Map: React.FC<PropsWithChildren<MapProps>> = ({ center, zoom, onPan, onZoom, children }) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={mapStyles.container}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onPan={onPan} onZoom={onZoom} />
      {children}
    </MapContainer>
  );
};

export default Map;
