
  // Initialize Firebase
var config = {
    apiKey: "AIzaSyDGNSm1C03dFxch6fX1xl9cECFZ3g9Tu_E",
    authDomain: "train-scheduler-b6b3c.firebaseapp.com",
    databaseURL: "https://train-scheduler-b6b3c.firebaseio.com",
    projectId: "train-scheduler-b6b3c",
    storageBucket: "",
    messagingSenderId: "715275184220"
  };

  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();
