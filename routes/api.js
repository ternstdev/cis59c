var express = require('express');
var router = express.Router();

var allAnimalsData = require('./allAnimalsData');

const mysql = require('mysql');
const dbUser = require('./dbUser');
let dbconn = mysql.createConnection(dbUser);
dbconn.connect();

router.get('/test/', function (req, res, next) {


  dbconn.query(`
SELECT A.id, name, typeId, breed,
        age, shortDesc, houseTrained, specialNeeds,
        energy, affection, obedience, children,
        strangers, otherAnimals, GROUP_CONCAT(I.img SEPARATOR ',') AS imgs
  FROM animals A
  LEFT JOIN animal_images I
  ON A.id = I.animalId
  GROUP BY A.id`,
    function (error, results, fields) {
      if (error) {
        res.send(error);
        throw error;
      }
      
      let test = [];
      let blargh;// = new {};
      
      results.forEach(row => {
        blargh = {};
        row.imgs = row.imgs.split(",");
        Object.keys(row).forEach(key => blargh[key] = row[key]);
        test.push(blargh);
      });

      
      res.send(JSON.stringify(test));
      //res.send(JSON.stringify(results));
    });
  //res.send("lol");
});





router.get('/pets/animals/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let filteredArray = [];

  // If no filters specified, return full data set.
  if (Object.keys(req.query).length <= 0) {
    return res.json(allAnimalsData);
  }

  // Max filters is 10. If more are requested, return empty array.
  if (Object.keys(req.query).length > 10) {
    return res.json(filteredArray);
  }

  filteredArray = allAnimalsData.filter((animal) => {
    return Object.keys(req.query).every(key => {
      // If this key doesn't exist, return false.
      if (!(key in animal)) {
        return false;
      }

      let keyValues = req.query[key].split(",", 5);
      let doesKeyValueMatch = keyValues.some(keyValue => {
        return (animal[key].toString().toLowerCase() === keyValue.toString().toLowerCase());
      });

      return doesKeyValueMatch;
    });
  });

  res.json(filteredArray);

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
  animals[0].name; // For example, this returns the name of the 1st animal.
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
allAnimalsRequest.response[0].name; // For example, this returns the name of the 1st animal.

/**/