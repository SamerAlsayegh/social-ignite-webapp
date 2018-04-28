const fs = require('fs');
const util = require('util');

// Soon this whole process will be handled automatically in the backend for easier syncing of the errorCodes/platforms.

let convertFile = function (originalFile) {
    let errorCodes = require("./" + originalFile + "Main.js");
    let finalCodes = {};
    let num = 0;


    for (let codeName in errorCodes) {
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
    let copyCodes = Object.assign({}, finalCodes);

    for (let codeName in copyCodes) {
        let codeId = copyCodes[codeName].id;
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

    fs.writeFile("./src/app/enums/" + originalFile + ".js", "module.exports = " + util.inspect(finalCodes, false, null) + ";", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Updated " + originalFile);
    });
};
convertFile("errorCodes");
convertFile("platforms");