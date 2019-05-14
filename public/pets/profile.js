"use strict";
var $ = function (id) { return document.getElementById(id); };

// global Keys for saving in browser
var arrayOfProfileObjects = [];
var arrayOfProfileObjectsStorageKey = "arrayOfProfileObjectsStorageKey";

var currentlySelectedProfileObjectNameStorageKey = "currentlySelectedProfileObjectNameStorageKey";

//  ==========================================
//
//  Funtions for generating the profile ID
//

var counter = 0;
var counterStartingValue = 100;
var localStorageCounterKey = "localStorageCounterKey";

var counterInitialize = function () {

    counter = counterStartingValue;
    localStorage.setItem(localStorageCounterKey, counter);
}

var counterGetNextNumber = function () {

    var result = JSON.parse(localStorage.getItem(localStorageCounterKey));

    if (result == null) {
        counterInitialize();
    }

    counter += 1;
    localStorage.setItem(localStorageCounterKey, JSON.stringify(counter));
    return (counter);
}

//  ==========================================

var printProfileObject = function (profileObject) {

    console.log("==================================");
    if (profileObject != null) {
        console.log(profileObject);
    }
    console.log("==================================");
}


var removeProfileObjectWithMatchingUserName = function (inputUserName) {

    var tempArrayOfProfileObjects;

    for (var i = 0; i < arrayOfProfileObjects.length; i++) {
        if (inputUserName == arrayOfProfileObjects[i]["name"]) {

            // remove the one object
            // "splice()" returns the object removed from the array -- which we do not have any need for
            tempArrayOfProfileObjects = arrayOfProfileObjects.splice(i, 1);
            saveArrayOfProfileObjects();
        }
    }
}



/*
// Not currently being used
var getProfileObjectWithMatchingId = function(inputId) {

    var failureReturnCode = -1;
    for (var i = 0; i < arrayOfProfileObjects.length; i++) {
         if (inputId == arrayOfProfileObjects[i][id]) {
             return arrayOfProfileObjects[i];
         }
    }
    return failureReturnCode;
}
*/

var profileObjectAlreadyExists = function (profileObject) {

    // var returnCode = false;

    for (var i = 0; i < arrayOfProfileObjects.length; i++) {
        if (profileObject["name"] == arrayOfProfileObjects[i]["name"]) {
            console.log("Profile Found for Name = " + profileObject["name"]);
            return true;
        }
    }
    return false;
}


var updateProfileInArrayOfProfileObjects = function (profileObject) {

    for (var i = 0; i < arrayOfProfileObjects.length; i++) {
        if (profileObject["name"] == arrayOfProfileObjects[i]["name"]) {
            console.log("Match found for Name = " + profileObject["name"]);
            arrayOfProfileObjects[i]["name"] = profileObject["name"];
            arrayOfProfileObjects[i]["houseTrained"] = profileObject["houseTrained"];
            arrayOfProfileObjects[i]["energy"] = profileObject["energy"];
            arrayOfProfileObjects[i]["affection"] = profileObject["affection"];
            arrayOfProfileObjects[i]["obedience"] = profileObject["obedience"];
            arrayOfProfileObjects[i]["children"] = profileObject["children"];
            arrayOfProfileObjects[i]["strangers"] = profileObject["strangers"];
            arrayOfProfileObjects[i]["otherAnimals"] = profileObject["otherAnimals"];
            arrayOfProfileObjects[i]["typeId"] = profileObject["typeId"];
        }
    }
}

var clearArrayOfProfileObjects = function () {
    arrayOfProfileObjects = [];
    saveArrayOfProfileObjects();
}

var makeProfileObject = function (
    name, houseTrained, energy, affection, obedience, children, strangers, otherAnimals, types) {

    var profileAsString = "{\"name\":\"" + name + "\""
        + ",\"id\":\"" + counterGetNextNumber() + "\""
        + ",\"houseTrained\":\"" + houseTrained + "\""
        + ",\"energy\":\"" + energy + "\""
        + ",\"affection\":\"" + affection + "\""
        + ",\"obedience\":\"" + obedience + "\""
        + ",\"children\":\"" + children + "\""
        + ",\"strangers\":\"" + strangers + "\""
        + ",\"otherAnimals\":\"" + otherAnimals + "\""
        + ",\"typeId\":\"" + types + "\"}";

    console.log("As a String  " + profileAsString);

    var profileAsObject = JSON.parse(profileAsString);
    console.log("As an Object  " + JSON.stringify(profileAsObject));
    return (profileAsObject);
}


let saveArrayOfProfileObjects = function () {

    if (arrayOfProfileObjects.length == 0) {
        console.log("arrayOfProfileObjects is empty so re-initializing it");
        initializeArrayOfProfileObjects();
    }

    localStorage.setItem(arrayOfProfileObjectsStorageKey, JSON.stringify(arrayOfProfileObjects));
}

//  ==========================================


var prepareWebpage = function () {

    console.log("Running PrepareWebpage()");
    //
    retrieveSavedArrayOfProfileObjects();

    var html = "";

    if (numberOfProfileObjects() == 0) {

        initializeArrayOfProfileObjects();
        printAllProfileObjects();

        // $("profile_action").innerHTML = "make_new_profile";
        console.log("numberOfProfileObjects == 0");

        html += "<option value=\"" + "make_new_profile" + "\">Make New Profile<\/option>";

        $("profile_action").innerHTML = html;   // NOTE:  Not Appending ... just setting the value.

        // make sure User Name text box is empty !!!
        $("profile_name").value = "";

    } else {
        // alert("Existing Profile Objects found:  " + numberOfProfileObjects());
        printAllProfileObjects();

        // add intro line to the drop down menus:
        html = "<option value=\"make_new_profile\">Make New Profile</option>";

        // add profileObjects to drop down menu (HTML "Select")
        for (var index in arrayOfProfileObjects) {

            if (($("profile_action").value.length > 0) && (arrayOfProfileObjects[index]["name"] == $("profile_name").value)) {

                html += "<option value=\"" + arrayOfProfileObjects[index]["name"] + "\" selected>" + arrayOfProfileObjects[index]["name"] + "<\/option>";

            } else {
                html += "<option value=\"" + arrayOfProfileObjects[index]["name"] + "\">" + arrayOfProfileObjects[index]["name"] + "<\/option>";
            }
        }

        console.log("New HTML = " + html);
        $("profile_action").innerHTML = "";         // first, clear all entries
        $("profile_action").innerHTML += html;
    }
}


var removeCurrentlyDisplayedProfile = function () {

    // remove the current profile (that which is on screen and any reference if found in array of saved profiles.)

    // First, make profileObject of all screen values
    
    var typeIdCheckboxes = document.querySelectorAll('input[name="typeId"]:checked');
    var typeIdString = "";
    
    for (var i = 0, l = typeIdCheckboxes.length; i < l;  ++i) {
        if (typeIdString) {
            typeIdString += ",";
        }
        typeIdString += typeIdCheckboxes[i].value;
    }
    
    var screenProfileObject = makeProfileObject($("profile_name").value,

        // might be more efficient to convert the boolean to a number here (before saving to storage)
        $("houseTrained").checked,
        $("energy").value,
        $("affection").value,
        $("obedience").value,
        $("children").value,
        $("strangers").value,
        $("otherAnimals").value,
        typeIdString);

    if ($("profile_name").value == "") {

        // $("MissingProfileName").innerHTML = "Sorry.  Must enter a profile name";
        // $("MissingProfileName").style = "color:red";

        setScreenDefaults()

    } else {

        var userProfile = getProfileObjectWithMatchingUserName(screenProfileObject["name"]);
        if (userProfile != -1) {
            removeProfileObjectWithMatchingUserName(userProfile["name"]);
            setScreenDefaults();
        }
        prepareWebpage();
    }

    // lastly remove this entry from the currently saved ("default") storage
    localStorage.removeItem(currentlySelectedProfileObjectNameStorageKey);

}


var saveCurrentlyOnScreenProfile = function () {

    console.log("Running saveCurrentlyOnScreenProfile()");

    console.log("savingOnScreenProfile:  Name = " + $("profile_name").value);

    var nameElement = $("profile_name");
    if (nameElement.value == "") {

        //$("profile_name").innerHTML = "Sorry.  Must enter a profile name";
        nameElement.classList.add("is-error");
        formReturnToFirstPage();
        nameElement.addEventListener("focus", function (evt) { this.classList.remove("is-error"); });
        return; // exit this method

    } else {
        //$("profile_name").innerHTML = "*";
        nameElement.classList.remove("is-error");
    }
    
    var typeIdCheckboxes = document.querySelectorAll('input[name="typeId"]:checked');
    var typeIdString = "";
    
    for (var i = 0, l = typeIdCheckboxes.length; i < l;  ++i) {
        if (typeIdString) {
            typeIdString += ",";
        }
        typeIdString += typeIdCheckboxes[i].value;
    }
    
    var screenProfileObject = makeProfileObject(nameElement.value,
        $("houseTrained").checked,
        $("energy").value,
        $("affection").value,
        $("obedience").value,
        $("children").value,
        $("strangers").value,
        $("otherAnimals").value,
        typeIdString);

    // IF, Profile NAME is already in array (database), then let's just do an Update (replace)
    // Rather than creating a new (additional) entry.

    if (profileObjectAlreadyExists(screenProfileObject)) {
        updateProfileInArrayOfProfileObjects(screenProfileObject);
    } else {
        // since not already in array, add it to array
        arrayOfProfileObjects.push(screenProfileObject);
    }

    saveArrayOfProfileObjects();

    // save currently displayed profile name:
    localStorage.setItem(currentlySelectedProfileObjectNameStorageKey, $("profile_name").value);

    prepareWebpage();
    $("add-form").submit();
}


var clearSavedValues = function () {

    console.log("Clearing Saved Profile Values");
    clearArrayOfProfileObjects();

    // clear "default" Profile name:
    localStorage.removeItem(currentlySelectedProfileObjectNameStorageKey);

    prepareWebpage();
}


var setScreenDefaults = function () {

    console.log("Setting Screen Default Values");

    // but retain current profile name...

    var currentProfileName = $("profile_name").value

    var makeSelectionProfileObject = makeProfileObject(currentProfileName, true,
        "make_selection", "make_selection", "make_selection", "make_selection", "make_selection", "make_selection", "make_selection");

    // update webpage with default values

    //    $("profile_action").innerHTML = "";
    //    $("profile_action").innerHTML += "<option value=\"" + "make_new_profile" + "\">Make New Profile<\/option>";

    updateWebpageWithProfileObject(makeSelectionProfileObject);
}


var updateWebpageWithProfileObject = function (profileObject) {

    $("profile_name").value = profileObject["name"];
    $("houseTrained").checked = profileObject["houseTrained"];
    $("energy").value = profileObject["energy"];
    $("affection").value = profileObject["affection"];
    $("obedience").value = profileObject["obedience"];
    $("children").value = profileObject["children"];
    $("strangers").value = profileObject["strangers"];
    $("otherAnimals").value = profileObject["otherAnimals"];
    
    if (profileObject.typeId) {
        var typeIdCheckboxes = document.getElementsByName('typeId');
        //var typeIdArray = profileObject["typeId"].split(",");
        for (var i = 0, l = typeIdCheckboxes.length; i < l;  ++i) {
            if (profileObject["typeId"].includes(typeIdCheckboxes[i].value))
            {
                typeIdCheckboxes[i].checked = true;
            }
        }
    }
}


var setProfile = function () {

    let userSelection = $("profile_action").value;
    console.log("Selected Profile = " + userSelection);

    // Action could be a profile OR, it could be "Make New Profile"
    if (userSelection == "make_new_profile") {
        // create a new profileObject with default "Make Selection" values
        // var defaultProfileObject = makeProfileObject("Three", 3, 3, 3, 3, 3, 3);
        var defaultProfileObject = makeProfileObject("", true,
            "make_selection", "make_selection", "make_selection", "make_selection", "make_selection", "make_selection", "make_selection");

        // then, display matching profile on web page
        updateWebpageWithProfileObject(defaultProfileObject);

    } else {
        // retrieve matching profile (based on "name"),
        let userProfile = getProfileObjectWithMatchingUserName(userSelection);

        // then, display matching profile on web page
        updateWebpageWithProfileObject(userProfile);
    }
}

window.onload = function () {

    // look for and load any previous profiles
    prepareWebpage()
    $("add-form-submit").onclick = saveCurrentlyOnScreenProfile;
    //$("set_defaults").onclick = setScreenDefaults;
    $("clear_saved_values").onclick = clearSavedValues;
    $("delete_this_profile").onclick = removeCurrentlyDisplayedProfile;
    $("profile_action").onchange = setProfile;

};




