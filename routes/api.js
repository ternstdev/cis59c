var express = require('express');
var router = express.Router();

/*
router.get('/', function (req, res) {
  res.send('Welcome to our API!');
}); */

router.get('/', function (req, res, next) {
  let allPets = {
    0: {
      name: "Rocky",
      breed: "Terrier Mix",
      shortDesc: "Rocky is a friendly, well behaved pup and the perfect companion for long walks!",
      imgs: { 0: "./img/rockygrizzled.jpg" },
    },
    1: {
      name: "Scout",
      breed: "Terrier Mix",
      shortDesc: "Scout is a spunky terrier who loves nothing more than taking a nap on your lap!",
      imgs: { 0: "./img/scoutportrait.jpg" },
    },
    2: {
      name: "Teddy",
      breed: "Terrier Mix",
      shortDesc: "Teddy loves to play fetch and jam to his <a href=\"https://www.youtube.com/watch?v=ci_pCk0l-WA\">favorite song</a>!",
      imgs: { 0: "./img/teddy.jpg" },
    },
    3: {
      name: "Badger",
      breed: "Cool Guy",
      shortDesc: "When he's not making funny faces, Badger can most often be found curled up under a pile of blankets.",
      imgs: { 0: "./img/badger.jpg" },
    },
    4: {
      name: "Hedgy",
      breed: "Hedgehog",
      shortDesc: "Don't let his spikey exterior fool you — Hedgy the Hedgehog is full of love!",
      imgs: { 0: "./img/hedgy.jpg" },
    },
    5: {
      name: "Emily",
      breed: "Formosan Mountain Dog",
      shortDesc: "Emily is wary of new people, but give her a few treats, and she'll warm up to you!",
      imgs: { 0: "./img/emily.jpg" },
    },
  };
  
  res.json([
    allPets
  ]);
});

module.exports = router;