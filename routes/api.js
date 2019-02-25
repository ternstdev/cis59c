var express = require('express');
var router = express.Router();

var allAnimalsData = require('./allAnimalsData');


router.get('/pets/animals/', function (req, res, next) {
  res.json(allAnimalsData);
});

router.get('/pets/animals/:id', function (req, res, next) {
  const found = allAnimalsData.some(animal => animal.id === parseInt(req.params.id));

  if (found) {
    res.json(allAnimalsData.filter(animal => animal.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No animal found with id ${req.params.id}` });
  }
  res.json(allAnimalsData);
});

module.exports = router;