const express = require("express");
const app = express();
const fs = require("fs");
const LogFileSize = require("./LogFile");
const handleData = require("./CallBackResponseHandler");

let logSize = 256;
let size = 0;
let indexValueCurrent = 0;
let count = 0;
let descriptFile;
let fileSize = LogFileSize("example.txt");

fs.open("example.txt", "r", (error, fd) => {
    if (error) console.log(error);
    console.log(fd);
    descriptFile = fd;
});

app.get("/", async(req, res) => {
    const { lines, index } = req.query;
    if (typeof lines !== "undefined") {
        size = logSize * +lines;
    } else {
        size = logSize;
    }

    if (size > fileSize) {
        return res.json(handleData(false, "Size limit exceeded", size, null));
    }

    let buffer = new Buffer.alloc(size);

    if (index === "forward" && count !== 0) {
        indexValueCurrent += size;
        if (indexValueCurrent > fileSize) {
            return res.json(
                handleData(false, "Size limit exceeded. Go backwards.", null, null)
            );
        }
    }
    if (index === "backward") {
        indexValueCurrent -= size;
        if (indexValueCurrent <= 0) {
            indexValueCurrent = 0;
        }
    }

    const data = await new Promise((resolve, reject) => {
        fs.read(
            descriptFile,
            buffer,
            0,
            buffer.length,
            indexValueCurrent,
            (err, bytes) => {
                if (err) reject(err);
                if (bytes > 0) {
                    resolve(buffer.slice(0, bytes).toString());
                }
                console.log(bytes + " bytes read");
            }
        );
    });

    count += 1;
    console.log("Number of Call Count: ", count);
    return res.json(handleData(true, null, size, data));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));