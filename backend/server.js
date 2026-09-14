const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { execFile } = require("child_process");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT;
const cppExecutable = path.resolve(__dirname, "..","build", "HuffmanFileCompressor.exe");

function uploadsCleaner(requestDir)
{
    fs.rm(requestDir, {recursice : true, force : true}, (error) => {
        if(error) console.error(error);
    });
}

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        const requestId = randomUUID();
        const uploadDir = path.join(__dirname, "uploads", requestId);
        fs.mkdir(uploadDir, {recursive : true}, (err) => {
            if(err) return cb(err);
            cb(null, uploadDir);
        });
    },
    filename : (req, file, cb) => {
        const originalName = path.basename(file.originalname);
        cb(null, originalName);
    }
});

const upload = multer({storage : storage});

app.get("/", (req,res) => {
    res.send("HuffmanFileCompressor backend is running.");
});

app.post("/compress", upload.single("file"), (req,res) => {
    const inputFilePath = req.file.path;
    const requestDir = path.dirname(inputFilePath);
    execFile(cppExecutable, [1, inputFilePath], (error, stdout) => {
        if(error){
            console.error(error);
            uploadsCleaner(requestDir);
            return res.status(500).send("Compression Failed.");
        }
        const compressedFilePath = stdout.trim();
        console.log("C++ compression completed.");
        res.download(compressedFilePath, (error) => {
            if(error){
                console.error(error);
                res.status(500).send("File transmission problem.");
            } 
            uploadsCleaner(requestDir);
        });
    })
});

app.post("/decompress", upload.single("file"), (req,res) => {
    const inputFilePath = req.file.path;
    const requestDir = path.dirname(inputFilePath);
    execFile(cppExecutable, [2 ,inputFilePath], (error, stdout) => {
        if(error){
            console.error(error);
            uploadsCleaner(requestDir);
            return res.status(500).send("Decompression Failed.");
        }
        const decompFilePath = stdout.trim();
        console.log("C++ decompression completed.");
        res.download(decompFilePath, (error) => {
            if(error){
                console.error(error);
                res.status(500).send("File transmission problem.");
            }
            uploadsCleaner(requestDir);
        });
    })
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
