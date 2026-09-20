const fs = require("fs");

function uploadsCleaner(requestDir)
{
    fs.rm(requestDir, {recursive : true, force : true}, (error) => {
        if(error) console.error("Failed to clean requested directory: ", error);
    });
}

module.exports = uploadsCleaner;