import React, { PropsWithChildren } from 'react';
import mapStyles from '../../styles/Map.module.css';

interface Map {
  center: google.maps.LatLngLiteral;
  zoom: number;
  onPan?: (newLat: number, newLng: number) => void;
  onZoom?: (newZoom: number) => void;
}

const Map: React.FC<PropsWithChildren<Map>> = ({
    center,
    zoom,
    onPan,
    onZoom,
    children
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
    function onCenterChanged(this: google.maps.Map) {
      const center = this.getCenter();
      if (onPan && center) {
        onPan(center.lat(), center.lng());
      }
    }

    function onZoomChanged(this: google.maps.Map) {
      const zoom = this.getZoom();
      if (onZoom && zoom) {
        onZoom(zoom);
      }
    }
  
    React.useEffect(() => {
      if (ref.current && !map) {
        const newMap = new window.google.maps.Map(ref.current, {
          zoom,
          center
        });
        newMap.addListener('center_changed', onCenterChanged);
        newMap.addListener('zoom_changed', onZoomChanged)
        setMap(newMap);
      }
    }, [ref, map, zoom, center]);
  
    return (<div ref={ref} id="map" className={mapStyles.container}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
      }
    })}
    </div>);
  };

  export default Map;