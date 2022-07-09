import { prependOnceListener } from "process";
import React, { Children, PropsWithChildren } from "react";
import mapStyles from "../../styles/Map.module.css"

interface Map {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const Map: React.FC<PropsWithChildren<Map>> = ({
    center,
    zoom,
    children
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
  
    React.useEffect(() => {
      if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current, {
          zoom,
          center
        }));
      }
    }, [ref, map]);
  
    return (<div ref={ref} id="map" className={mapStyles.container}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
      }
    })}
    </div>);
  }

  export default Map;