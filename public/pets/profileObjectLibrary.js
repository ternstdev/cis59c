//  ==========================================
//
//  ArrayOfProfileObject Routines (library?)
//

var getProfileObjectWithMatchingUserName = function (inputUserName) {

    var failureReturnCode = -1;

    for (var i = 0; i < arrayOfProfileObjects.length; i++) {
        if (inputUserName == arrayOfProfileObjects[i]["name"]) {
            return arrayOfProfileObjects[i];
        }
    }

    return failureReturnCode;
}

var retrieveSavedArrayOfProfileObjects = function () {

    arrayOfProfileObjects = JSON.parse(localStorage.getItem(arrayOfProfileObjectsStorageKey));
    if (arrayOfProfileObjects == null) {
        initializeArrayOfProfileObjects();
    }
}

var printAllProfileObjects = function () {

    if (arrayOfProfileObjects.length == 0) {
        console.log("arrayOfProfileObjects is Empty");
    } else {
        for (var i = 0; i < arrayOfProfileObjects.length; i++) {
            var profileAsString = JSON.stringify(arrayOfProfileObjects[i]);
            console.log("Object[" + i + "]  " + profileAsString);
        }
    }
}

var numberOfProfileObjects = function () {

    if (arrayOfProfileObjects == null) {
        retrieveSavedArrayOfProfileObjects();
    }

    return arrayOfProfileObjects.length;
}

var initializeArrayOfProfileObjects = function () {

    arrayOfProfileObjects = [];

    console.log("initializeArrayOfProfileObjects:  Saving empty array of Profile Objects");

    localStorage.setItem(arrayOfProfileObjectsStorageKey, JSON.stringify(arrayOfProfileObjects));
}

//
//  End of File
//
//  ==========================================

