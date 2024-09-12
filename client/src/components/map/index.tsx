import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';

interface MapProps {
  address: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ address, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;

      const google = (window as any).google;
      new google.maps.Map(mapRef.current, {
        zoom: 16,
      });
    };

    if ((window as any).google) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.onload = loadMap;
      document.head.appendChild(script);
    }
  }, [address]);

  return (
    <div className={`${styles.mapContainer} ${className}`}>
      <div
        ref={mapRef}
        className={styles.map}
      />
    </div>
  );
};

export default Map;
