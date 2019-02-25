var express = require('express');
var router = express.Router();

/*
router.get('/', function (req, res) {
  res.send('Welcome to our API!');
}); */

router.get('/pets/all', function (req, res, next) {
  const allPets = [
    {
      id: 0,
      name: "Rocky",
      breed: "Terrier Mix",
      shortDesc: "Rocky is a friendly, well behaved pup and the perfect companion for long walks!",
      imgs: ["./img/rockygrizzled.jpg"],
    },
    {
    id: 1,
      name: "Scout",
      breed: "Terrier Mix",
      shortDesc: "Scout is a spunky terrier who loves nothing more than taking a nap on your lap!",
      imgs: ["./img/scoutportrait.jpg"],
    },
    {
    id: 2,
      name: "Teddy",
      breed: "Terrier Mix",
      shortDesc: "Teddy loves to play fetch and jam to his <a href=\"https://www.youtube.com/watch?v=ci_pCk0l-WA\">favorite song</a>!",
      imgs: ["./img/teddy.jpg"],
    },
    {
    id: 3,
      name: "Badger",
      breed: "Cool Guy",
      shortDesc: "When he's not making funny faces, Badger can most often be found curled up under a pile of blankets.",
      imgs: ["./img/badger.jpg"],
    },
    {
    id: 4,
      name: "Hedgy",
      breed: "Hedgehog",
      shortDesc: "Don't let his spikey exterior fool you — Hedgy the Hedgehog is full of love!",
      imgs: ["./img/hedgy.jpg"],
    },
    {
    id: 5,
      name: "Emily",
      breed: "Formosan Mountain Dog",
      shortDesc: "Emily is wary of new people, but give her a few treats, and she'll warm up to you!",
      imgs: ["./img/emily.jpg"],
    },
  ];
  
  res.json(allPets);
  
});

module.exports = router;