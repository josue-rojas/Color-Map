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
    const center = this.map.getCenter();
    const corner = this.map.getBounds()._ne;
    const distance = GeoFire.distance([center.lat, center.lng], [corner.lat, corner.lng]);
    // make the query
    const query = geoFireRef.query({
      center: [center.lat, center.lng],
      radius: distance
    })

    // then finally check the map is loaded and add each point to the map
    this.map.on('load', ()=> {
      query.on("key_entered", (key, location, distance, customData)=>{
        // if(this.map.getLayer(key)){
        //   this.map.removeLayer(key);
        //   this.map.removeSource(key)
        // }
        // TODO: should not remove source since it is the same
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
        // firebaseRef.child(key).on('value', (a)=>{
        //   const el = a.val();
        //   if(this.map.getLayer(el.g)){
        //     console.log('drop layer')
        //     this.map.removeLayer(el.g);
        //     this.map.removeSource(el.g);
        //   }
        //   // else{
        //     // add each point source (only if the layer exist (key is the same as the coords))
        //     // this.map.addSource(el.g, {
        //     //   "type": "geojson",
        //     //   "data": {
        //     //     "type": "FeatureCollection",
        //     //     "features": [{
        //     //       "type": "Feature",
        //     //       "geometry": {
        //     //         "type": "Point",
        //     //         "coordinates": [el.l[1],el.l[0]]
        //     //       }
        //     //     }]
        //     //   }
        //     // });
        //   // }
        //   this.map.addSource(el.g, {
        //     "type": "geojson",
        //     "data": {
        //       "type": "FeatureCollection",
        //       "features": [{
        //         "type": "Feature",
        //         "geometry": {
        //           "type": "Point",
        //           "coordinates": [el.l[1],el.l[0]]
        //         }
        //       }]
        //     }
        //   });
        //
        //   // then add the layer
        //   this.map.addLayer({
        //     "id": el.g,
        //     "type": "circle",
        //     "source": el.g,
        //     "paint": {
        //       "circle-radius": 7,
        //       "circle-color": el.color,
        //       "circle-opacity": .4
        //     }
        //   });
        //
        //   console.log('get second id'+el.g, this.map.getLayer(el.g));
        //
        //
        // });
      });
      // query.on('key_moved', (key, location, distance, customData)=>{
      //   console.log('key moved')
      // });

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
