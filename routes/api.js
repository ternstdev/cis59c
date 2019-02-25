var express = require('express');
var router = express.Router();

var allAnimalsData = require('./allAnimalsData');


router.get('/pets/animals/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json(allAnimalsData);
});

router.get('/pets/animals/:id', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const found = allAnimalsData.some(animal => animal.id === parseInt(req.params.id));

  if (found) {
    res.json(allAnimalsData.filter(animal => animal.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No animal found with id ${req.params.id}` });
  }
  res.json(allAnimalsData);
});

module.exports = router;

/* // Examples of using the API:

// Fetch Example:

fetch('https://api.tay.fail/pets/animals') // Initiates the request.
.then(function (response) { // Once we receive a response, run the function below.
  var animals = response.json() // Converts the response from JSON into an object or array (in our case, an array).
  return animals;
})
.then(function (animals) { // After converting the response into an array, run the function below.
  // This is where we'd loop through the results and write it to the DOM.
  // We should probably also check that the response is valid at this point (but we can do that later).
  animals[0].name; // For example, this displays the name of the 1st animal.
});



// XMLHttpRequest Example:

// Create our variables.
var allAnimalsURL = 'https://api.tay.fail/pets/animals';
var allAnimalsRequest = new XMLHttpRequest();

allAnimalsRequest.open('GET', allAnimalsURL); // Define our request method and URL.
allAnimalsRequest.responseType = 'json'; // Define what type of response we're expecting.
allAnimalsRequest.send(); // Send the request.
// Now we can access the response (either an object or array - in our case, an array).
// This is where we'd loop through the results and write it to the DOM.
allAnimalsRequest.response[0].name // For example, this displays the name of the 1st animal.

/**/