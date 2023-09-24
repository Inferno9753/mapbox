import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import Map, { FullscreenControl, GeolocateControl, Marker, NavigationControl, Source, Layer } from 'react-map-gl';
function App() {
  // eslint-disable-next-line
  const [start, setStart] = useState([22, 79.1]);
  // eslint-disable-next-line
  const [end, setEnd] = useState([21, 79]);
  const [coordinates, setCoordinates] = useState([]);
  
  useEffect(() => {
    getRoute();
    // eslint-disable-next-line
  }, [end,start])


  const getRoute = async () => {
    const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.REACT_APP_TOKEN}`
      , { method: 'GET' }
    );
    const data = await res.json();
    const coords = data.routes[0].geometry.coordinates;
    setCoordinates(coords)
  }

  const geojson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "features",
        "geometry": {
          "type": "LineString",
          "coordinates": [...coordinates]
        }
      }
    ]
  }

  const lineStyle={
    id:'readLayer',
    type:'line',
    layout:{
      "line-join":"round",
      "line-cap":"round"
    },
    paint:{
      "line-color":"blue",
      "line-width":4,
      "line-opacity":0.75
    }
  }
  // const handleClick=(e)=>{
  //   const newEnd=e.lngLat;
  //   const endPoint=Object.keys(newEnd).map((item)=>newEnd[item]);
  //   setEnd(endPoint);
  // }

  return (
    <div>
      <Map
        mapboxAccessToken={process.env.REACT_APP_TOKEN}
        style={{
          width: "100vw",
          height: "100vh",
          borderRadius: "15px",
          border: "2px solid red",
        }}
        initialViewState={{
          longitude: start[0],
          latitude: start[1],
        }}
        mapStyle="mapbox://styles/inferno97531/clmx03ou502p901pb8saq1be7"
      >
        <Source id='routeSource' type='geojson' data={geojson}>
          <Layer {...lineStyle} />
        </Source>
        <Marker latitude={start[0]} longitude={start[1]} />
        <Marker latitude={end[0]} longitude={end[1]} />
        <NavigationControl position='bottom-right' />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </div>
  )
}

export default App;
