var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const crypto = require("crypto");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../public/pets/img/');
  },
  filename: function(req, file, cb) {
    const originalname = file.originalname;
    const extensionTemp = originalname.split(".");
    const extension = extensionTemp[extensionTemp.length - 1];
    const randId = crypto.randomBytes(16).toString("hex");
    
    const filename = randId + '.' + extension;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      callback(createError(415, new Error("Invalid image format (jpg, jpeg, or png only)")), false);
    } else {
      callback(null, true)
    }
  }
});

//var upload = multer({ dest: '../public/pets/img/', limits: { fieldSize: 5 * 1024 * 1024 } });
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

/**
 * 
 * @param { import('express').Request } req
 */
const validateInput = (req) => {
  let validationResult = { msg: "", isSuccess: true, fields: {} };
  let isSuccess = true;
  
  let fieldName = "id"; // int(11)
  if (req.body[fieldName]) {
    if (!canParseInt(req.body[fieldName], 0, 999999999)) {
      isSuccess = false;
      validationResult.fields[fieldName] = req.body[fieldName];
    }
  }
  
  fieldName = "name"; // varchar(31)
  if (!req.body[fieldName] || req.body[fieldName].length > 30) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "typeId"; // int(11)
  if (!canParseInt(req.body[fieldName], 0, 30)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
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
  if (!req.body[fieldName] || req.body[fieldName].length > 30) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "age"; // tinyint(3)
  if (!canParseInt(req.body[fieldName], 0, 250)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "shortDesc"; // varchar(1022)
  if (!req.body[fieldName] || req.body[fieldName].length > 1000) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "longDesc"; // text
  if (!req.body[fieldName] || req.body[fieldName].length > 3000) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "houseTrained"; // tinyint(1)
  if (req.body[fieldName] && !canParseInt(req.body[fieldName], 0, 1)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "specialNeeds"; // tinyint(1)
  if (req.body[fieldName] && !canParseInt(req.body[fieldName], 0, 1)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "energy"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "affection"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "obedience"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
    
  }
  
  fieldName = "children"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "strangers"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  fieldName = "otherAnimals"; // tinyint(3) unsigned
  if (!canParseInt(req.body[fieldName], 0, 5)) {
    isSuccess = false;
    validationResult.fields[fieldName] = req.body[fieldName];
  }
  
  if (isSuccess === true) {
    validationResult.msg = "Success";
    validationResult.isSuccess = true;
  } else {
    validationResult.msg = "Invalid Request";
    validationResult.isSuccess = false;
  }
  return validationResult;
};

/**
 * 
 * @param {{[fieldname: string]: Express.Multer.File[];} | Express.Multer.File[]} files
 */
// const validateAndProcessImages = (files) => {
//   if (files && Array.isArray(files) && files.length > 0) {
//     for (let i = 0; i < files.length; ++i) {
//       let imgFile = files[i];
//       let newExt = '';
//       if (imgFile.originalname.includes('.jpg') || imgFile.originalname.includes('.jpeg')) {
//         newExt = '.jpg';
//       } else if (imgFile.originalname.includes('.png')) {
//         newExt = '.png';
//       } else {
//         return false;
//       }

//       fs.rename(imgFile.path, (imgFile.path + newExt), function(err) {
//         if (err) {
//           console.log('ERROR: ' + err);
//           throw err;
//         }
//       });
//     }
//   }
//   return true;
// }

/**
 * 
 * @param {{[fieldname: string]: Express.Multer.File[];} | Express.Multer.File[]} files
 */
const deleteImages = (files) => {
  if (files && Array.isArray(files) && files.length > 0) {
    for (let i = 0; i < files.length; ++i) {
      fs.unlink(files[i].path, function(err) {
        if (err) {
          console.log('ERROR: ' + err);
          throw err;
        }
      });
    }
  }
}


router.get('/test/', function(req, res, next) {
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
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      let test = [];
      let blargh; // = new {};
      
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





router.get('/pets/animals/', function(req, res, next) {
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
          age, shortDesc, longDesc, houseTrained, specialNeeds,
          energy, affection, obedience, children,
          strangers, otherAnimals, IFNULL(GROUP_CONCAT(I.img SEPARATOR ','), "") AS imgs
    FROM animals A
    LEFT JOIN animal_images I
    ON A.id = I.animalId
    GROUP BY A.id`,
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      results.forEach(row => {
        // Format / clean the currrent row.
        row.imgs = row.imgs.split(",");
        if (!row.longDesc) {
          row.longDesc = "";
        }
        
        // Add the current row to the fullResult array.
        tempAnimal = {};
        Object.keys(row).forEach(key => tempAnimal[key] = row[key]); // TODO: Use an array with the key names instead.
        fullResult.push(tempAnimal);
      });
      
      // If no animals are found, return w/ message.
      if (!fullResult || fullResult.length <= 0) {
        return res.status(404).json({ msg: `No animals matching the provided criteria was found.` });
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


router.get('/pets/animals/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  let fullResult = [];
  let tempAnimal;
  
  dbconn.query(`
  SELECT A.id, name, typeId, breed,
          age, shortDesc, longDesc, houseTrained, specialNeeds,
          energy, affection, obedience, children,
          strangers, otherAnimals, IFNULL(GROUP_CONCAT(I.img SEPARATOR ','), "") AS imgs
    FROM animals A
    LEFT JOIN animal_images I
    ON A.id = I.animalId
    GROUP BY A.id`,
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      
      results.forEach(row => {
        // Format / clean the currrent row.
        row.imgs = row.imgs.split(",");
        if (!row.longDesc) {
          row.longDesc = "";
        }
        
        // Add the current row to the fullResult array.
        tempAnimal = {};
        Object.keys(row).forEach(key => tempAnimal[key] = row[key]); // TODO: Use an array with the key names instead.
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


router.post('/pets/animals/', upload.array('imgs', 12), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var validationResult = validateInput(req);
  
  if (validationResult.isSuccess === false) {
    deleteImages(req.files);
    return res.status(406).json(validationResult);
  }
  
  // if (validateAndProcessImages(req.files) === false) {
  //   deleteImages(req.files);
  //   return res.status(415).json({ msg: `Invalid image format (jpg, jpeg, or png only)`, isSuccess: false });
  // }
  
  const newAnimalData = [
    req.body["name"],
    req.body["typeId"],
    req.body["breed"],
    req.body["age"],
    req.body["shortDesc"],
    req.body["longDesc"],
    req.body["houseTrained"] || 0,
    req.body["specialNeeds"] || 0,
    req.body["energy"],
    req.body["affection"],
    req.body["obedience"],
    req.body["children"],
    req.body["strangers"],
    req.body["otherAnimals"]
  ];
  
  dbconn.query(`
  INSERT INTO animals (name, typeId, breed,
          age, shortDesc, longDesc, houseTrained,
          specialNeeds, energy, affection, obedience,
          children, strangers, otherAnimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    newAnimalData,
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (let i = 0; i < req.files.length; ++i) {
          let imgFile = req.files[i];
          let newImg = [results.insertId, imgFile.filename]
          dbconn.query(`
          INSERT INTO animal_images (animalId, img)
          VALUES (?, ?)`,
            newImg,
            function(error, results, fields) {
              if (error) {
                res.status(400).send(error);
                return next(error);
              }
              
            });
        }
      }
      
      res.status(201).json({ msg: "Success", isSuccess: true, id: results.insertId });
    });
});




router.post('/pets/images/:id', upload.array('imgs', 12), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const searchId = parseInt(req.params.id);
  if (isNaN(searchId) || !(searchId >= 0)) {
    deleteImages(req.files);
    return res.status(404).json({ msg: `No animal found with id ${req.params.id}`, isSuccess: false });
  }
  
  if (!req.files || req.files.length < 1) {
    return res.status(404).json({ msg: `No image was found in the request.`, isSuccess: false });
  }
  
  dbconn.query(`
  SELECT id FROM animals`,
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      if (!results.length) {
        deleteImages(req.files);
        return res.status(404).json({ msg: `No animal found with id ${req.params.id}`, isSuccess: false });
      }
      
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (let i = 0; i < req.files.length; ++i) {
          let imgFile = req.files[i];
          let newImg = [req.params.id, imgFile.filename]
          dbconn.query(`
      INSERT INTO animal_images (animalId, img)
      VALUES (?, ?)`,
            newImg,
            function(error, results, fields) {
              if (error) {
                res.status(400).send(error);
                return next(error);
              }
            });
        }
        res.status(201).json({ msg: "Success", isSuccess: true });
      }
      //res.status(201).json({ msg: "Success", isSuccess: true});
    });
});


router.delete('/pets/animals/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const searchId = parseInt(req.params.id);
  if (isNaN(searchId) || !(searchId >= 0)) {
    return res.status(404).json({ msg: `No animal found with id ${req.params.id}`, isSuccess: false });
  }
  
  dbconn.query(`
  SELECT id, img FROM animal_images WHERE animalId = ?`,
    [searchId],
    function(error, results, fields) {
      if (error) {
        res.status(400).send(error);
        return next(error);
      }
      
      
      
      if (results.length) {
        results.forEach((row) => {
          if (row.img.length) {
            fs.unlink('../public/pets/img/' + row.img, function(err) {
                if (err) {
                  console.log('ERROR: ' + err);
                  throw err;
                }
              });
            }
          });
        //return res.status(404).json({ msg: `No animal found with id ${req.params.id}`, isSuccess: false });
      }
      
      dbconn.query(`
      DELETE FROM animal_images WHERE animalId = ? `,
        [searchId],
        function(error, results, fields) {
          if (error) {
            res.status(400).send(error);
            return next(error);
          }
          
          dbconn.query(`
          DELETE FROM animals WHERE id = ? `,
            [searchId],
            function(error, results, fields) {
              if (error) {
                res.status(400).send(error);
                return next(error);
              }
              
              if (results.affectedRows) {
                return res.status(200).json({ msg: `Successfully deleted id ${req.params.id}`, isSuccess: true });
              } else {
                return res.status(404).json({ msg: `No animal found with id ${req.params.id}`, isSuccess: false });
              }
            });
          
        });
      
      
      
      //res.status(201).json({ msg: "Success", isSuccess: true});
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
