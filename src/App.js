import React, { Component } from 'react';
import Button from './Components/Button';
import Footer from './Components/Footer';
import Form from './Components/Form';
import Mapbox from './Components/Mapbox';
import './Styles/App.css';
import firebase from './firebase.js';
// https://github.com/arnetuk/geofire-js this geofire has support for extra data set
import GeoFire from 'geofire';

const firebaseRef = firebase.database().ref('points');
const geoFireRef = new GeoFire(firebaseRef);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      formActive: false,
      disableGeolocation: false,
      firebaseRef: null,
      geoFire: null,
      GeoFire: GeoFire,
      // points: [],
    }
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount(){
    // const firebaseRef = firebase.database().ref('points');
    // const geoFireRef = new GeoFire(firebaseRef);

    this.setState({
      firebaseRef: firebaseRef,
      geoFireRef: geoFireRef,
      hasGeolocation: ("geolocation" in navigator),
    });

    // const query = geoFireRef.query({
    //   center:[40.8592951,-73.865675],
    //   radius: 10
    // })

    // query.on("key_entered", (key, location)=>{
    //   firebaseRef.child(key).once('value', (a)=>{
    //     this.setState({points: [...this.state.points, a.val()]})
    //     // console.log(a.val());
    //   });
    // });

  }

  toggleForm(value){
    let formActive = value ? value : !this.state.formActive;
    this.setState({formActive: value})
  }

  render() {
    return (
      <div className='app'>
        <Mapbox
          GeoFire={this.state.GeoFire}
          firebaseRef={this.state.firebaseRef}
          geoFireRef={this.state.geoFireRef} />
        <Button
          className={'form-btn'}
          onClick={this.toggleForm}
          color={'#7b7b7b'}
          hoverColor={'rgb(93, 93, 93)'}
          text={'New Point'}/>
        <Footer/>
        <Form
          geoFireRef={this.state.geoFireRef}
          firebaseRef={this.state.firebaseRef}
          closeForm={()=>{this.toggleForm(false)}}
          isActive={this.state.formActive}/>
      </div>
    );
  }
}
export default App;
