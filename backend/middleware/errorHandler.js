const uploadsCleaner = require("../utils/uploadsCleaner");

function errorHandler(error, req, res, next)
{
    if(req.requestDir) uploadsCleaner(req.requestDir);
    
    return res.status(500).send("File Upload Failed.");
}

module.exports = errorHandler;