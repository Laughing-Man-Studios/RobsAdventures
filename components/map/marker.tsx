import React from 'react';
import { Marker as LeafletMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon broken by webpack asset handling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface MarkerProps {
  position: { lat: number; lng: number };
  label: string;
}

const Marker: React.FC<MarkerProps> = ({ position, label }) => {
  return (
    <LeafletMarker position={[position.lat, position.lng]}>
      <Tooltip permanent>{label}</Tooltip>
    </LeafletMarker>
  );
};

export default Marker;
