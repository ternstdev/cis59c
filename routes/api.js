var express = require('express');
var router = express.Router();

var allAnimalsData = require('./allAnimalsData');

const mysql = require('mysql');
const dbUser = require('./dbUser');
let dbconn = mysql.createConnection(dbUser);
dbconn.connect();

const canParseInt = (text, min, max) => {
  const num = parseInt(text)
  return ( (!isNaN(num)) && (num >= min) && (num <= max) );
}

const validateInput = (req) => {
  let i = -1;
  if (req.param("id")) {
    if (!canParseInt(req.param("id"), 0, 9999999)) {
      return false;
    }
  }
  if (!req.param("name") || req.param("name").length > 20) {
    return false;
  }
  
  if (!canParseInt(req.param("typeId"), 0, 30)) {
    return false;
  }
  
  if (!req.param("breed") || req.param("breed").length > 20) {
    return false;
  }
  
  if (!canParseInt(req.param("age"), 0, 200)) {
    return false;
  }
  
  if (!req.param("shortDesc") || req.param("shortDesc").length > 100) {
    return false;
  }
  
  if (!canParseInt(req.param("houseTrained"), 0, 5)) {
    return false;
  }
  
  
  if (!(req.param("specialNeeds"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("energy"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("affection"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("obedience"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("children"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("strangers"), 0, 5)) {
    return false;
  }
  if (!canParseInt(req.param("otherAnimals"), 0, 5)) {
    return false;
  }
  
  return true;
  
};

const validateInput2 = (req) => {
  let i = -1;
  if (req.param("id")) {
    if (canParseInt(req.param("id"), 0, 9999999)) {
      return "id";
    }
  }
  if (!req.param("name") || req.param("name").length > 20) {
    return "name";
  }

  if (canParseInt(req.param("typeId"), 0, 30)) {
    return "typeId";
  }

  if (!req.param("breed") || req.param("breed").length > 20) {
    return "breed";
  }

  if (canParseInt(req.param("age"), 0, 200)) {
    return "age";
  }

  if (!req.param("shortDesc") || req.param("shortDesc").length > 100) {
    return "shortDesc";
  }

  if (canParseInt(req.param("houseTrained"), 0, 5)) {
    return "houseTrained";
  }


  if (canParseInt(req.param("specialNeeds"), 0, 5)) {
    return "specialNeeds";
  }
  if (canParseInt(req.param("energy"), 0, 5)) {
    return "energy";
  }
  if (canParseInt(req.param("affection"), 0, 5)) {
    return "affection";
  }
  if (canParseInt(req.param("obedience"), 0, 5)) {
    return "obedience";
  }
  if (canParseInt(req.param("children"), 0, 5)) {
    return "children";
  }
  if (canParseInt(req.param("strangers"), 0, 5)) {
    return "strangers";
  }
  if (canParseInt(req.param("otherAnimals"), 0, 5)) {
    return "otherAnimals";
  }

  return "";

};


router.get('/test/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


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
        res.status(400).send(error);
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

  let filteredResult = [];


  let fullResult = [];
  let tempAnimal;

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
        res.status(400).send(error);
        throw error;
      }


      results.forEach(row => {
        tempAnimal = {};
        row.imgs = row.imgs.split(",");
        Object.keys(row).forEach(key => tempAnimal[key] = row[key]);
        fullResult.push(tempAnimal);
      });

      // If no filters specified, return full data set.
      if (Object.keys(req.query).length <= 0) {
        //return res.json(allAnimalsData);
        return res.json(fullResult);
      }

      // Max filters is 10. If more are requested, return empty array.
      if (Object.keys(req.query).length > 10) {
        return res.status(400).json(filteredResult);
      }

      filteredResult = fullResult.filter((animal) => {
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

      res.json(filteredResult);
    });
});

router.get('/pets/animals/:id', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let fullResult = [];
  let tempAnimal;

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
        res.status(400).send(error);
        throw error;
      }


      results.forEach(row => {
        tempAnimal = {};
        row.imgs = row.imgs.split(",");
        Object.keys(row).forEach(key => tempAnimal[key] = row[key]);
        fullResult.push(tempAnimal);
      });

      const found = fullResult.some(animal => animal.id === parseInt(req.params.id));

      if (found) {
        res.json(fullResult.filter(animal => animal.id === parseInt(req.params.id)));
      } else {
        res.status(400).json({ msg: `No animal found with id ${req.params.id}` });
      }
    });
});


router.post('/pets/animals/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var validationResult = validateInput2(req);
  if (validationResult) {
    return res.status(400).json({ msg: `Invalid Request`, field: validationResult });
  }
  
  let fullResult = [];
  let tempAnimal;
  const newAnimalData = [
    req.param("name"),
    req.param("typeId"), 
    req.param("breed"), 
    req.param("age"), 
    req.param("shortDesc"), 
    req.param("houseTrained"), 
    req.param("specialNeeds"), 
    req.param("energy"), 
    req.param("affection"), 
    req.param("obedience"), 
    req.param("children"), 
    req.param("strangers"), 
    req.param("otherAnimals")
  ];
  
  dbconn.query(`
  INSERT INTO animals (name, typeId, breed,
          age, shortDesc, houseTrained, specialNeeds,
          energy, affection, obedience, children,
          strangers, otherAnimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    newAnimalData,
    function (error, results, fields) {
      if (error) {
        res.status(400).send(error);
        throw error;
      }

      return res.json({ id: results.insertId });
      
      });
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