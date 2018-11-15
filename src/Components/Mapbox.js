import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';


// initial code from https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
export default class Mapbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      points: [],
    }
    this.makePoints = this.makePoints.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2l0aGNoZWVzZXBscyIsImEiOiJjam9mNmlubTEwMTYwM3BueGNvbW92cXR5In0.aC-cPbUGitfW_4lrx92KSA';
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/withcheesepls/cjog1f02r1ds52so0vdjqibye',
      center: [-73.865675, 40.8592951],
      zoom: 9
    });

  }

  componentWillUnmount() {
    this.map.remove();
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
        // console.log('hello');
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

        this.map.addLayer({
          "id": key,
          "type": "circle",
          "source": key,
          "paint": {
            "circle-radius": 7,
            "circle-color": customData.color,
            "circle-opacity": .4
          }
        });

        // ummm the only thing changing should be the color if not then later add error checking
        firebaseRef.child(key).on('child_changed', (a)=>{
          // console.log('hello')
          this.map.removeLayer(key);
          this.map.addLayer({
            "id": key,
            "type": "circle",
            "source": key,
            "paint": {
              "circle-radius": 7,
              "circle-color": a.val(),
              "circle-opacity": .4
            }
          });
        });

      });

      this.map.on('moveend', ()=>{
        // console.log('moveend')
        center = this.map.getCenter();
        corner = this.map.getBounds()._ne;
        distance = GeoFire.distance([center.lat, center.lng], [corner.lat, corner.lng]);
        query.updateCriteria({
          center: [center.lat, center.lng],
          radius: distance
        });
      });

      query.on('key_exited', (key, location, distance, customData)=>{
        this.map.removeLayer(key);
        this.map.removeSource(key);
        firebaseRef.child(key).off('child_changed')
        // console.log('key exite');
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
