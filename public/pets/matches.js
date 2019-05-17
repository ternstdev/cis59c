"use strict";
var $ = function (id) { return document.getElementById(id); };

// global Keys for saving in browser
var arrayOfProfileObjects = [];
var arrayOfProfileObjectsStorageKey = "arrayOfProfileObjectsStorageKey";

const currentlySelectedProfileObjectNameStorageKey = "currentlySelectedProfileObjectNameStorageKey";

var animalsArray = [];   // here is a more global variable

//  ==========================================
//
//  Method to get array of objects from server
//

var retrieveAdoptablePetsFromServer = function () {

    fetch('https://api.tay.fail/pets/animals') // Initiates the request.
        .then(function (response) { // Once we receive a response, run the function below.
            var animals = response.json() // Converts the response from JSON into an object or array (in our case, an array).
            return animals;
        })
        .then(function (animals) {

            animalsArray = animals;

            let matchCount = document.getElementById("match-count");
            if (matchCount) {
                matchCount.setAttribute("data-badge", animals.length);
            }

            for (var i = 0; i < animals.length; ++i) {
                // animalsArray.push (animals[i]); // but, 
                // may need to do actual copy rather than just keep a reference

            }
        })
        .catch(function () {

            console.log("Error with Network 'fetch' call");
        });
}

var printAnimalObject = function (animalObject) {


}

//  ==========================================

var prepareWebpage = function () {

    retrieveSavedArrayOfProfileObjects();

    //retrieveAdoptablePetsFromServer();
    // printAnimalObject(animalsArray[0]);  // pass in one object

    var html = "";

    if (numberOfProfileObjects() == 0) {

        initializeArrayOfProfileObjects();
        printAllProfileObjects();

        html += "<option value=\"" + "select_profile" + "\">No Profiles Available<\/option>";

        $("select_profile").innerHTML = html;   // NOTE:  Not Appending ... just setting the value.

    } else if (numberOfProfileObjects == 1) {

        // if only one object, just set this to be the selected profile.
        html += "<option value=\"" + arrayOfProfileObjects[0]["name"] + "\">" + arrayOfProfileObjects[0]["name"] + "<\/option>";

    } else {

        // alert("Existing Profile Objects found:  " + numberOfProfileObjects());
        printAllProfileObjects();

        // add intro line to the drop down menus:
        html = "<option value=\"select_profile\">Select Profile</option>";

        // add profileObjects to drop down menu (HTML "Select")
        for (var index in arrayOfProfileObjects) {

            html += "<option value=\"" + arrayOfProfileObjects[index]["name"] + "\">" + arrayOfProfileObjects[index]["name"] + "<\/option>";
        }

        $("select_profile").innerHTML = "";         // first, clear all entries
        $("select_profile").innerHTML += html;
    }
}

var lookForMatches = function () {

    var profileToMatch = getProfileObjectWithMatchingUserName($("select_profile").value);

    // if no available profiles, display message saying "make a profile", else, ...
    if (numberOfProfileObjects() == 0) {
        alert("Error:  no profiles available.  First make a profile");
        return;
    }

    if ($("select_profile").value == "select_profile") {
        alert("Error:  Must select a profile");
        return;
    }

    // alert("Now Look for matches with profile: " + profileToMatch["name"]);

    if (typeof animalsArray === 'undefined') {
        // then, alert user there was problem downloading anamal data from server
        alert("Error:  There was problem retrieving animal data from server");
        return;
    }
    let url = 'https://api.tay.fail/pets/animals';
    if (profileToMatch.typeId) {
        url += "?typeId=" + profileToMatch.typeId;
    }
    // otherwise, passes all checks so now look for matches.
    fetch(url) // Initiates the request.
        .then(function (response) { // Once we receive a response, run the function below.
            var animals = response.json() // Converts the response from JSON into an object or array (in our case, an array).
            return animals;
        })
        .then(function (animals) {
            calculateMatchness(profileToMatch, animals);
            let matchCount = document.getElementById("match-count");
            if (matchCount) {
                matchCount.setAttribute("data-badge", animals.length);
            }
        })
        .catch(function () {

            console.log("Error with Network 'fetch' call");
        });
}

var calculateMatchness = function (profileObject, animalsArray) {

    // we calculate the difference between the profile and animal value,
    // then we square the difference.  
    // Then we add up the squares of the differences.
    // Modeled after the "least squares" algorithm.

    for (var i = 0; i < animalsArray.length; ++i) {
        let total = 0;
        total += Math.pow(animalsArray[i].energy - profileObject.energy, 2);
        total += Math.pow(animalsArray[i].affection - profileObject.affection, 2);
        
        // If the animal is less obedient than the person requires, it is a bad match - increase matchness.
        // However, if the animal is more obedient than the person requires, it is still a good match - no increase to matchness.
        if (animalsArray[i].obedience < profileObject.obedience)
            total += Math.pow(animalsArray[i].obedience - profileObject.obedience, 2);
        
        // If the animal is worse with children than the person requires, it is a bad match - increase matchness.
        // However, if the animal is better with children than the person's lifestyle requires, it is still a good match - no increase to matchness.
        if (animalsArray[i].children < profileObject.children)
            total += Math.pow(animalsArray[i].children - profileObject.children, 2);
        
        // If the animal is worse with strangers than the person requires, it is a bad match - increase matchness.
        // However, if the animal is better with strangers than the person's lifestyle requires, it is still a good match - no increase to matchness.
        if (animalsArray[i].strangers < profileObject.strangers)
            total += Math.pow(animalsArray[i].strangers - profileObject.strangers, 2);
        
        // If the animal is worse with other animals than the person requires, it is a bad match - increase matchness.
        // However, if the animal is better with other animals than the person's lifestyle requires, it is still a good match - no increase to matchness.
        if (animalsArray[i].otherAnimals < profileObject.otherAnimals)
            total += Math.pow(animalsArray[i].otherAnimals - profileObject.otherAnimals, 2);
        
        // since houseTrained is a boolean string (either "true" or "false")
        // need to convert it to a number (true => 1, false = 0)
        let houseTrainedAsANumber = 0;
        if (profileObject.houseTrained == "true") {
            houseTrainedAsANumber = 1;
        }
        
        // If the animal is not house trained and the person wants a house trained animal, it is a bad match - increase matchness.
        // However, if the animal is house trained and the person doesn't care if the animal is house trained or not, it is still a good match - no increase to matchness.
        if (animalsArray[i].houseTrained < houseTrainedAsANumber)
            total += 1;
        // no point in squaring a value which is either '0' or '1'

        // now add property to animal object
        animalsArray[i].matchness = total;
    }


    let customSort2 = function (a, b) {
        // Lower numbers are "better" matches.
        // So, sorting with smaller numbers first
        // As secondary index, sorting on "names" by alphabetic / ASCII values
        if (a.matchness == b.matchness) {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return +1;
            } else {
                return 0;
            }
        } else {
            return a.matchness - b.matchness;
        }
    }


    // make a custom sort function
    let customSort = function (field) {
        return function (a, b) {
            if (a[field] < b[field]) {
                return -1;
            } else if (a[field] < b[field]) {
                return 1;
            }
            return 0;
        };
    }

    // now, sort the array based on the "matchness" field
    animalsArray.sort(customSort2);
    displayAnimals(animalsArray);
    // now, print out the results
    // let html = "<p>Matches (best matches first)<\/p>";

    // for (var i = 0; i < animalsArray.length; i++) {
    //     console.log("name = " + animalsArray[i].name + " with Matchness = " + animalsArray[i].matchness);
    //     html += "<p>\"" + animalsArray[i].name + ":  " + animalsArray[i].matchness + "\"</p>";

    //     //        html += "<option value=\"" + arrayOfProfileObjects[index]["name"] + "\" selected>" + arrayOfProfileObjects[index]["name"] + "<\/option>";

    // }

    // $("resultDiv").innerHTML = html;
}


//  ==========================================

window.onload = function () {

    // look for and load any previous profiles
    prepareWebpage()
    $("find_matches").onclick = lookForMatches;

    var currentUser = localStorage.getItem(currentlySelectedProfileObjectNameStorageKey);
    if (currentUser && arrayOfProfileObjects.some(function (profile) { return profile.name === this; }), currentUser) {
        $("select_profile").value = currentUser;
        var animalGrid = document.createElement("div");
        animalGrid.id = "main-grid";
        document.getElementsByClassName("wrapper")[0].appendChild(animalGrid);
        window.setTimeout(lookForMatches, 1000);
    }

};




