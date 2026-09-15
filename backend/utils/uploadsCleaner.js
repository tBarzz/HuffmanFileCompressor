const fs = require("fs");

function uploadsCleaner(requestDir)
{
    fs.rm(requestDir, {recursice : true, force : true}, (error) => {
        if(error) console.error("Failed to clean requested directory: ", error);
    });
}

module.exports = uploadsCleaner;