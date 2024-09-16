// src/components/map/index.tsx

import React, { useEffect, useRef } from 'react';
import { getCoordinatesFromAddress } from '../../utils/geocode'; // Import the utility function
import styles from './index.module.scss';

interface MapProps {
  address: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ address, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const google = (window as any).google;
        const map = new google.maps.Map(mapRef.current, {
          zoom: 14,
          mapTypeControl: false,  
          streetViewControl: false, 
          fullscreenControl: false, 
        });

        // Get coordinates from the address
        const { lat, lng } = await getCoordinatesFromAddress(address);

        // Set map center to the coordinates
        const location = new google.maps.LatLng(lat, lng);
        map.setCenter(location);

        // Add a marker at the location
        new google.maps.Marker({
          position: location,
          map: map,
        });
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    if ((window as any).google) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initializeMap;
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
