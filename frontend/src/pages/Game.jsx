import React, { useEffect, useRef, useState } from 'react';
import './Game.css'; // Import the CSS file

const Game = () => {
  const streetViewRef = useRef(null);
  const mapRef = useRef(null);
  const [actualLocation, setActualLocation] = useState(null); // Store the original location
  const [guessMarker, setGuessMarker] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [timer, setTimer] = useState(null); // Timer for unhover effect

  useEffect(() => {
    const getRandomCoordinates = () => {
      const lat = Math.random() * (37 - (-35)) + (-35); // Latitude between -35 and 37
      const lng = Math.random() * (51 - (-18)) + (-18); // Longitude between -18 and 51
      return { lat, lng };
    };

    const findStreetViewLocation = (attempt = 0) => {
      const streetViewService = new window.google.maps.StreetViewService();
      const radius = 50000; // 50 km radius
      const maxAttempts = 5; // Maximum number of attempts

      const coords = getRandomCoordinates();

      streetViewService.getPanorama(
        {
          location: coords,
          radius: radius,
          source: window.google.maps.StreetViewSource.OUTDOOR, // Filter for car-based coverage
        },
        (data, status) => {
          if (status === window.google.maps.StreetViewStatus.OK) {
            // If a valid Street View location is found
            setActualLocation(data.location.latLng); // Save the original location
            const panorama = new window.google.maps.StreetViewPanorama(
              streetViewRef.current,
              {
                position: data.location.latLng,
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
              }
            );

            // Initialize the map with the same location
            const mapInstance = new window.google.maps.Map(mapRef.current, {
              center: data.location.latLng,
              zoom: 8,
              scrollwheel: true, // Enable scroll zoom without Ctrl
              gestureHandling: 'auto', // Allow standard gesture handling
            });

            // Add a marker to the map at the actual location using google.maps.Marker
            const marker = new window.google.maps.Marker({
              position: data.location.latLng,
              map: mapInstance,
            });

            setGuessMarker(marker);
          } else if (attempt < maxAttempts) {
            // Try another random location if no street view is available and attempts remain
            findStreetViewLocation(attempt + 1);
          } else {
            // Fall back to a default location if no Street View is found after max attempts
            console.error("No Street View location found after maximum attempts.");
          }
        }
      );
    };

    findStreetViewLocation();
  }, []);

  // Handle click event on the map
  useEffect(() => {
    if (guessMarker && mapRef.current) {
      guessMarker.getMap().addListener('click', (event) => {
        const { latLng } = event;

        // Move the marker to the new clicked location
        guessMarker.setPosition(latLng);

        // Log the location of the new marker to the console
        console.log(`Marker moved to: Latitude: ${latLng.lat()}, Longitude: ${latLng.lng()}`);

        // Calculate and log the distance between the original location and the guess
        if (actualLocation) {
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(actualLocation, latLng);
          console.log(`Distance from original location: ${(distance / 1000).toFixed(2)} km`);
        }
      });
    }
  }, [guessMarker, actualLocation]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timer) {
      clearTimeout(timer);
    }
  };

  const handleMouseLeave = () => {
    const newTimer = setTimeout(() => {
      setIsHovered(false);
    }, 500);
    setTimer(newTimer);
  };

  return (
    <div>
      <div ref={streetViewRef} className="street-view-container"></div>
      <div
        ref={mapRef}
        className={`map-container ${isHovered ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>
    </div>
  );
};

export default Game;
