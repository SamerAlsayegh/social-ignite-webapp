const fs = require('fs');
const util = require('util');
var convertFile = function (originalFile) {
    var errorCodes = require('./' + originalFile + "Main");
    var finalCodes = {};
    var num = 0;


    for (var codeName in errorCodes) {
        if (errorCodes[codeName].id && errorCodes[codeName].id < 0){
            // skip
            num++;
        } else {

            finalCodes[codeName] = {
                id: null,
                detail: null
            };
            finalCodes[codeName].id = num;
            if (finalCodes[codeName].hasOwnProperty("detail"))
                finalCodes[codeName].detail = errorCodes[codeName].detail;
            else
                finalCodes[codeName].detail = null;
            num++;
        }
    }
    var copyCodes = Object.assign({}, finalCodes);

    for (var codeName in copyCodes) {
        var codeId = copyCodes[codeName].id;
        if (codeId != null) {
            finalCodes[codeId] = {
                id: null,
                detail: null
            };
            finalCodes[codeId].id = codeName;
            if (finalCodes[codeId].hasOwnProperty("detail"))
                finalCodes[codeId].detail = copyCodes[codeName].detail;
            else
                finalCodes[codeId].detail = null;
        }
    }

    fs.writeFile(originalFile + ".js", "module.exports = " + util.inspect(finalCodes, false, null) + ";", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Updated " + originalFile);
    });
    fs.writeFile(originalFile + "R.js", "define(function (require, exports, module) { module.exports = " + util.inspect(finalCodes, false, null) + ";});", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Updated " + originalFile);
    });
};
convertFile("errorCodes");
convertFile("platforms");
