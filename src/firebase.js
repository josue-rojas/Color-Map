import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCWMqf2pmYbLYpYu1eohHRs7GueK5jsKcQ",
    authDomain: "color-map1.firebaseapp.com",
    databaseURL: "https://color-map1.firebaseio.com",
    projectId: "color-map1",
    storageBucket: "color-map1.appspot.com",
    messagingSenderId: "129169085202"
  };

firebase.initializeApp(config);
export default firebase;
