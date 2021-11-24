import React from 'react';
import './Map.scss'

interface IMap {
  mapType: google.maps.MapTypeId;
  mapTypeControl?: boolean;
}

interface IMarker {
  address: string;
  latitude: number;
  longitude: number;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

export const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<GoogleMap>();
  const [marker, setMarker] = React.useState<IMarker>();

  const startMap =  ():void => {
    if (!map) {
      defaultMapStart();
    }
  }

  const initEventListener = ():void => {
    if (map) {
      google.maps.event.addListener(map, 'click', function (e) {
        coordinateToAddress(e.latLng);
      })
    }
  };

  React.useEffect(initEventListener, [map]);

  const coordinateToAddress = async (coordinate: GoogleLatLng) => {
    const geocoder = new google.maps.Geocoder();
    await geocoder.geocode({location: coordinate}, function (results, status ) {
      if (status === 'OK') {
        setMarker({
          address: results[0].formatted_address,
          latitude: coordinate.lat(),
          longitude: coordinate.lng(),
        })
      }
    })
  }



  React.useEffect(startMap , [map]);

  const defaultMapStart = ():void => {
    const defaultAddress = new google.maps.LatLng(36.5514938, -4.6120551);
    initMap(14, defaultAddress)
  };

  
  const addSingleMarker = (): void => {
    if (marker) {
      addMarker(new google.maps.LatLng(marker.latitude, marker.longitude));
    }
  };
  
  React.useEffect(addSingleMarker, [marker])
  
  const addMarker = (location: GoogleLatLng): void => {
    const marker: GoogleMarker = new google.maps.Marker({
      position: location,
      map: map,
      icon: getIconAttribute('#000000')
    });
  };

  const getIconAttribute = (iconColor: string) => {
    return {
      path: 'M11.0639 15.3003L26.3642 2.47559e-05L41.6646 15.3003L26.3638 51.3639L11.0639 15.3003 M22,17.5a4.5,4.5 0 1,0 9,0a4.5,4.5 0 1,0 -9,0Z',
      fillColor: iconColor,
      fillOpacity: 0.8,
      strokeColor: 'pink',
      strokeWeight: 2,
      anchor: new google.maps.Point(30, 50)
    };
  };

  const initMap = (zoomLevel: number, address: GoogleLatLng):void => {
    if (ref.current) {
      setMap(
        new google.maps.Map(ref.current, {
          zoom: zoomLevel,
          center: address,
          mapTypeControl: mapTypeControl,
          streetViewControl: false,
          rotateControl: false,
          scaleControl: false,
          fullscreenControl: false,
          panControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative',
          mapTypeId: mapType,
          draggableCursor: 'pointer',
        })
      )
    }
  };
 
  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  )
} 