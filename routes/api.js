var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const multer = require('multer');
var upload = multer({ dest: '../public/pets/img/', limits: { fieldSize: 5 * 1024 * 1024 } });
// let upload = multer({
//   dest: '../public/pets/img/', limits: { fileSize: 3072 }, fileFilter: function (req, file, cb) {
//     let extType = path.extension(file.originalname);
//     if (extType !== 'jpg' && extType !== 'jpeg' && extType !== 'png') {
//       return cb(null, true);
//     } else {
//       return cb(null, true);
//     }
//   }
// });

var allAnimalsData = require('./allAnimalsData');

const mysql = require('mysql');
const dbUser = require('./dbUser');
let dbconn = mysql.createConnection(dbUser);
dbconn.connect();

const canParseInt = (text, min, max) => {
  const num = parseInt(text)
  return ((!isNaN(num)) && (num >= min) && (num <= max));
}

const validateInput = (req) => {
  let validationResult = { isValid: true, fields: {} };

  let fieldName = "id"; // int(11)
  if (req.param(fieldName)) {
    if (!canParseInt(req.param(fieldName), 0, 999999999)) {
      validationResult.isValid = false;
      validationResult.fields[fieldName] = req.param(fieldName);
    }
  }

  fieldName = "name"; // varchar(31)
  if (!req.param(fieldName) || req.param(fieldName).length > 30) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "typeId"; // int(11)
  if (!canParseInt(req.param(fieldName), 0, 30)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  // +----+-------------+
  // | id | animal_type |
  // +----+-------------+
  // |  0 | Other       |
  // |  1 | Bird        |
  // |  2 | Cat         |
  // |  3 | Caticorn    |
  // |  4 | Dog         |
  // |  5 | Ferret      |
  // |  6 | Fish        |
  // |  7 | Frog        |
  // |  8 | Hedgehog    |
  // |  9 | Horse       |
  // | 10 | Lizard      |
  // | 11 | Otter       |
  // | 12 | Pig         |
  // | 13 | Rabbit      |
  // | 14 | Rodent      |
  // | 15 | Snake       |
  // | 16 | Tortoise    |
  // | 17 | Turtle      |
  // +----+-------------+

  fieldName = "breed"; // varchar(30)
  if (!req.param(fieldName) || req.param(fieldName).length > 30) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "age"; // tinyint(3)
  if (!canParseInt(req.param(fieldName), 0, 250)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "shortDesc"; // varchar(1022)
  if (!req.param(fieldName) || req.param(fieldName).length > 1000) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "longDesc"; // text
  if (!req.param(fieldName) || req.param(fieldName).length > 3000) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "houseTrained"; // tinyint(1)
  if (req.param(fieldName) && !canParseInt(req.param(fieldName), 0, 1)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "specialNeeds"; // tinyint(1)
  if (req.param(fieldName) && !canParseInt(req.param(fieldName), 0, 1)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "energy"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "affection"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "obedience"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);

  }

  fieldName = "children"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "strangers"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  fieldName = "otherAnimals"; // tinyint(3) unsigned
  if (!canParseInt(req.param(fieldName), 0, 5)) {
    validationResult.isValid = false;
    validationResult.fields[fieldName] = req.param(fieldName);
  }

  return validationResult;
};


router.get('/test/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


  dbconn.query(`
SELECT A.id, name, typeId, breed,
        age, shortDesc, houseTrained, specialNeeds,
        energy, affection, obedience, children,
        strangers, otherAnimals, IFNULL(GROUP_CONCAT(I.img SEPARATOR ','), "") AS imgs
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

  // Max filters is 10. If more are requested, return error.
  if (Object.keys(req.query).length > 10) {
    return res.status(400).json({ msg: `Too many filters provided.` });
  }

  dbconn.query(`
  SELECT A.id, name, typeId, breed,
          age, shortDesc, houseTrained, specialNeeds,
          energy, affection, obedience, children,
          strangers, otherAnimals, IFNULL(GROUP_CONCAT(I.img SEPARATOR ','), "") AS imgs
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

      // If no animals are found, return w/ message.
      if (!fullResult || fullResult.length <= 0) {
        res.status(404).json({ msg: `No animals matching the provided criteria was found.` });
      }

      // If no filters specified, return full data set.
      if (Object.keys(req.query).length <= 0) {
        //return res.json(allAnimalsData);
        return res.json(fullResult);
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

      if (!filteredResult || filteredResult.length <= 0) {
        // If no animals are found, return w/ message.
        res.status(404).json({ msg: `No animals matching the provided criteria was found.` });
      } else {
        res.json(filteredResult);
      }
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
          strangers, otherAnimals, IFNULL(GROUP_CONCAT(I.img SEPARATOR ','), "") AS imgs
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
        res.status(404).json({ msg: `No animal found with id ${req.params.id}` });
      }
    });
});


router.post('/pets/animals/', upload.array('imgs', 12), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var validationResult = validateInput(req);

  if (validationResult.length !== 0) {
    if (req.files && req.files.length > 0) {
      req.files.forEach((imgFile) => {
        fs.unlink(imgFile.path, function (err) {
          if (err) {
            console.log('ERROR: ' + err);
            res.status(400).send(error);
            throw error;
          }
        });
      });
    }
    return res.status(406).json({ msg: "Invalid Request", validationResult });
  }

  const newAnimalData = [
    req.param("name"),
    req.param("typeId"),
    req.param("breed"),
    req.param("age"),
    req.param("shortDesc"),
    req.param("longDesc"),
    req.param("houseTrained") || 0,
    req.param("specialNeeds") || 0,
    req.param("energy"),
    req.param("affection"),
    req.param("obedience"),
    req.param("children"),
    req.param("strangers"),
    req.param("otherAnimals")
  ];

  dbconn.query(`
  INSERT INTO animals (name, typeId, breed,
          age, shortDesc, longDesc, houseTrained,
          specialNeeds, energy, affection, obedience,
          children, strangers, otherAnimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    newAnimalData,
    function (error, results, fields) {
      if (error) {
        res.status(400).send(error);
        throw error;
      }

      if (req.files && req.files.length > 0) {
        req.files.forEach((imgFile) => {
          let newExt = '';
          if (imgFile.originalname.includes('.jpg') || imgFile.originalname.includes('.jpeg')) {
            newExt = '.jpg';
          } else if (imgFile.originalname.includes('.png')) {
            newExt = '.png';
          } else {
            console.log('ERROR: ' + err);
            res.status(400).send(error);
            throw error;
          }

          fs.rename(imgFile.path, (imgFile.path + newExt), function (err) {
            if (err) {
              console.log('ERROR: ' + err);
              res.status(400).send(error);
              throw error;
            }
          });

          let newImg = [results.insertId, (imgFile.filename + newExt)]
          dbconn.query(`
          INSERT INTO animal_images (animalId, img)
          VALUES (?, ?)`,
            newImg,
            function (error, results, fields) {
              if (error) {
                res.status(400).send(error);
                throw error;
              }

            });
        });
      }

      res.status(201).redirect('/pets');
    });
});




router.post('/pets/images/:id', upload.array('imgs', 12), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var validationResult = validateInput(req);

  const searchId = parseInt(req.params.id);
  if (!(searchId >= 0) || isNaN(searchId)) {
    if (req.files && req.files.length > 0) {
      req.files.forEach((imgFile) => {
        fs.unlink(imgFile.path, function (err) {
          if (err) {
            console.log('ERROR: ' + err);
            res.status(400).send(error);
            throw error;
          }
        });
      });
    }
    return res.status(404).json({ msg: `No animal found with id ${req.params.id}` });
  }

  dbconn.query(`
  SELECT id FROM animals`,
    function (error, results, fields) {
      if (error) {
        res.status(400).send(error);
        throw error;
      }

      if (!results.length) {
        if (req.files && req.files.length > 0) {
          req.files.forEach((imgFile) => {
            fs.unlink(imgFile.path, function (err) {
              if (err) {
                console.log('ERROR: ' + err);
                res.status(400).send(error);
                throw error;
              }
            });
          });
        }
        return res.status(404).json({ msg: `No animal found with id ${req.params.id}` });
      }

      if (!req.files || req.files.length < 1) {
        return res.status(404).json({ msg: `${req.files} No image was found in the request.` });
      }

      req.files.forEach((imgFile) => {
        let newExt = '';
        if (imgFile.originalname.includes('.jpg') || imgFile.originalname.includes('.jpeg')) {
          newExt = '.jpg';
        } else if (imgFile.originalname.includes('.png')) {
          newExt = '.png';
        } else {
          req.files.forEach((imgFile) => {
            fs.unlink(imgFile.path, function (err) {
              if (err) {
                console.log('ERROR: ' + err);
                res.status(400).send(error);
                throw error;
              }
            });
          });
          return res.status(404).json({ msg: `Invalid image format (jpg, jpeg, or png only)` });
        }

        fs.rename(imgFile.path, (imgFile.path + newExt), function (err) {
          if (err) {
            console.log('ERROR: ' + err);
            res.status(400).send(error);
            throw error;
          }
        });

        let newImg = [req.params.id, (imgFile.filename + newExt)]
        dbconn.query(`
      INSERT INTO animal_images (animalId, img)
      VALUES (?, ?)`,
          newImg,
          function (error, results, fields) {
            if (error) {
              res.status(400).send(error);
              throw error;
            }

          });
      });
      res.status(201).redirect('/pets');
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