import React from 'react';
import './App.css';
import { Map } from './Map/Map'
import { loadMapApi } from './utils/GoogleMapsUtils';

function App() {
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  React.useEffect( () => {
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener('load', function() {
      setScriptLoaded(true)
    })
  }, []);


  return (
    <div className="App">
      <h1 className="title">Taxi Ya!</h1>
      {scriptLoaded && (
        <Map mapType={google.maps.MapTypeId.ROADMAP} mapTypeControl={true}/>
      )}
    </div>
  );
}

export default App;
