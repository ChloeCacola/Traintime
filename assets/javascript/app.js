//variables
var trainName
var destination
var firstTrain
var firstTrainTime 
var frequency 
var nextArrival
var currentTime
var diffTime
var timeRemainder
var minAway
var sv
var svArr 
var lastIndex 
var lastKey 
var lastObj 
var addTrainRow
var trainInfo



// Initialize Firebase
var config = {
  apiKey: "AIzaSyAJaXf16NJ06aXJHLhJmwqH5hl9wwfxPYg",
  authDomain: "traintime-c0cf1.firebaseapp.com",
  databaseURL: "https://traintime-c0cf1.firebaseio.com",
  storageBucket: "traintime-c0cf1.appspot.com",
  messagingSenderId: "718138743697"   
};

firebase.initializeApp(config);

//variable to reference the database
var database = firebase.database();


//add train on button click
$("#add-train").on("click", function() {

	//prevent form from submitting
	event.preventDefault();

	//storing and retrieving most recent train
	trainName = $("#train-name-input").val().trim();
	destination = $("#destination-input").val().trim();
	firstTrain = $("#train-time-input").val().trim();
	frequency = $("#frequency-input").val().trim();

	//calculating minutes away and next arrival of train with moment.js
	firstTrainTime = moment(firstTrain, "HH:mm").subtract(1,"years");

	currentTime = moment();

	diffTime = moment().diff(moment(firstTrainTime), "minutes");

	timeRemainder = diffTime % frequency;

	minAway = frequency - timeRemainder;
	console.log("Min till train: " + minAway);

	//Next arrival
	nextArrival = moment().add(minAway, "minutes");
	nextArrival = moment(nextArrival).format("HH:mm");
	console.log("next arrival: " +  nextArrival);

	//PUSH to database
	database.ref().push({
	trainName: trainName,
	destination: destination,
	firstTrain: firstTrain,
	frequency: frequency,
	nextArrival: nextArrival,
	minAway: minAway
	});


	//to not refresh page
	return false;

});

//info from database tree using keys
database.ref().on("value", function(snapshot) {

sv = snapshot.val();

svArr = Object.keys(sv);

lastIndex = svArr.length - 1;

lastKey = svArr[lastIndex];

lastObj = sv[lastKey];
	
});

//printing info from database of children added
database.ref().on("child_added", function(childSnapshot){

	//add individual values to the appropriate rows and columns!!**
	addTrainRow = $("#add-train-row");

	trainInfo = "<tr>";
	trainInfo += "<td>" + childSnapshot.val().trainName + "</td>";
	trainInfo += "<td>" + childSnapshot.val().destination + "</td>";
	trainInfo += "<td>" + childSnapshot.val().frequency + "</td>";
	trainInfo += "<td>" + childSnapshot.val().nextArrival + "</td>";
	trainInfo += "<td>" + childSnapshot.val().minAway + "</td>";
	trainInfo += "<tr>";
		
	addTrainRow.append(trainInfo);
	
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
});
