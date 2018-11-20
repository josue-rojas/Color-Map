## Color-Map

Choose a color for a location point to color a map. This project is inspired by https://en.wikipedia.org/wiki/Place_(Reddit).

This project uses react.js, mapbox, and firebase.

#### Resources I used
- https://css-tricks.com/intro-firebase-react/
- https://github.com/firebase/geofire-js


#### TODO:
- validation on firebase for data (database.rules.json)
- mapbox
  - geolocation point should be color chosen
  - make functions to enable event listener functions and disable for easier use
  - figure out a way to change the geolocation color (probably using this https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver, but will be trouble some in react since this goes againts the style)
- geofire: upload changes to repo (maybe fork original and do changes to that one)
- clean files (comments and console logs and fix warnings)
- style footer
- form submit check if success
- tidy up form.js especially the formInput function
- form should store locally if geolocation has permission

##### Secrets
Easily change your location using chrome: Open chrome and then open developer tools (Command+Option+I). Then click on developer menu (three dots button) and scroll to 'More Tools', there should be a 'Sensors' in the list. On 'Geolocation' change to 'Custom Location' and type in your desired coordinates.
