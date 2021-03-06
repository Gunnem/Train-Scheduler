  
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

// Display the current time
function currentTime() {
  var current = moment().local().format('hh:mm:ss A');
  $("#currentTime").html("The current time is " + current);
  setTimeout(currentTime, 1000);
};

// Set global variables
var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

// Store and retrieve data
$(".form-field").on("keyup", function() {
  var traintemp = $("#train-name").val().trim();
  var citytemp = $("#destination").val().trim();
  var timetemp = $("#first-train").val().trim();
  var freqtemp = $("#frequency").val().trim();

  sessionStorage.setItem("train", traintemp);
  sessionStorage.setItem("city", citytemp);
  sessionStorage.setItem("time", timetemp);
  sessionStorage.setItem("freq", freqtemp);
});

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

$("#submit").on("click", function(event) {
  event.preventDefault();

  // Alert if form is incomplete

  if ($("#train-name").val().trim() === "" ||
    $("#destination").val().trim() === "" ||
    $("#first-train").val().trim() === "" ||
    $("#frequency").val().trim() === "") {

    alert("Please fill in all details to add new train");

  } else {

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    sessionStorage.clear();
  }

});

// Calculate moment time values

database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;

  // Append new data to HTML

  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-dark btn-xs' data-key='" + key + "'>x</button></td>"));

  if (minToArrival < 6) {
    newrow.addClass("info");
  }

  $("#train-table-rows").append(newrow);

});

$(document).on("click", ".arrival", function() {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});

currentTime();

setInterval(function() {
  window.location.reload();
}, 60000);
