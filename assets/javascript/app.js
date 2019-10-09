// Initialize Firebase
var config = {
    apiKey: "AIzaSyDVbjiG3YZW3KjTSeneKPgxWn6gDP0Mr74",
    authDomain: "train-scheduler-51bc5.firebaseapp.com",
    databaseURL: "https://train-scheduler-51bc5.firebaseio.com",
    projectId: "train-scheduler-51bc5",
    storageBucket: "",
    messagingSenderId: "921283420102",
    appId: "1:921283420102:web:018f251e6eaf5886969cc7",
    measurementId: "G-WFS7NFYDCX"
  };

firebase.initializeApp(config);

var trainDB = firebase.database().ref();
// Holds the current time
$("#currentTime").append(moment().format("hh:mm A"));

// Button for adding trains
$("#addTrainButton").on("click", function() {
    event.preventDefault();
    // Gets user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("x");
    var frequency = $("#frequencyInput").val().trim();
    console.log(firstTrain);
    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    // Updates train data to the database
    trainDB.push(newTrain);

    // Shows additional train notification
    alert(newTrain.name + " has been successfully added");

    // Clears all text boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    return false;
});


// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainDB.on("child_added", function(childSnapshot) {

    let data = childSnapshot.val();
    let trainNames = data.name;
    let trainDestin = data.destination;
    let trainFrequency = data.frequency;
    let theFirstTrain = data.firstTrain;
    console.log(theFirstTrain);
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
    let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
    let tMinutes = trainFrequency - tRemainder;

    // To calculate the arrival time, add the tMinutes to the currrent time
    let tArrival = moment().add(tMinutes, "m").format("HH:mm");

    // Add each train's data into the table 
    $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");

    //  function displayTime() {
    //      $('#firstTrainInput').firstTrain({
    //          use24hours: true
    //      });
    //  };
    //  displayTime();
});

