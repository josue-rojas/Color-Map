import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

// some helper functions to clean things out
function getNewLayer(key, color) {
  return (
    {
      "id": key,
      "type": "circle",
      "source": key,
      "paint": {
        "circle-radius": {
          "stops": [
            [3, 2],
            [9, 4]
          ]
        },
        "circle-color": color,
        "circle-opacity": .4
      }
    }
  );
}

// initial code from https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
export default class Mapbox extends Component {
  constructor(props){
    super(props);
    this.makePoints = this.makePoints.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2l0aGNoZWVzZXBscyIsImEiOiJjam9mNmlubTEwMTYwM3BueGNvbW92cXR5In0.aC-cPbUGitfW_4lrx92KSA';
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/withcheesepls/cjog1f02r1ds52so0vdjqibye',
      zoom: 9,
      minZoom: 3,
      center: window.location.hash.length === 0 ? [-73.9395,40.79] : [],
      hash: true
    });
    const userlocation = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.map.addControl(userlocation);
  }

  componentWillUnmount() {
    this.map.remove();
    // TODO: also remove or stop query
  }

  makePoints(firebaseRef, geoFireRef, GeoFire){
    // make sure firebase and geofire are loaded to make the queries
    if(!firebaseRef || !geoFireRef || !GeoFire || !this.map) return

    // get the points of interest (center and a corner is fine)
    let center = this.map.getCenter();
    let corner = this.map.getBounds()._ne;
    let distance = GeoFire.distance([center.lat, center.lng], [corner.lat, corner.lng]);
    // make the query
    const query = geoFireRef.query({
      center: [center.lat, center.lng],
      radius: distance
    })

    // then finally check the map is loaded and add each point to the map
    this.map.on('load', ()=> {
      query.on("key_entered", (key, location, distance, customData)=>{
        // TODO: bug where source exist and crashes need to check if getSource and getLayer exist individually (same as line 111)
        if(this.map.getSource(key) && this.map.getLayer(key)) return;
        this.map.addSource(key, {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [location[1], location[0]]
              }
            }]
          }
        });

        this.map.addLayer(getNewLayer(key, customData.color));

        // ummm the only thing changing should be the color if not then later add error checking
        firebaseRef.child(key).on('child_changed', (a)=>{
          this.map.removeLayer(key);
          this.map.addLayer(getNewLayer(key, a.val()));
        });
      });

      // update query to new location
      this.map.on('moveend', ()=>{
        center = this.map.getCenter();
        corner = this.map.getBounds()._ne;
        distance = GeoFire.distance([center.lat, center.lng], [corner.lat, corner.lng]);
        query.updateCriteria({
          center: [center.lat, center.lng],
          radius: distance
        });
      });

      query.on('key_exited', (key, location, distance, customData)=>{
        // TODO: check the logic before returning
        if(!this.map.getSource(key) && !this.map.getLayer(key)) return;
        this.map.removeLayer(key);
        this.map.removeSource(key);
        firebaseRef.child(key).off('child_changed')
      });

    });
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };
    this.makePoints(this.props.firebaseRef, this.props.geoFireRef, this.props.GeoFire);
    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}
