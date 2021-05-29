const http = require("http");
const fs = require("fs");

const hostname = "127.0.0.1";
const port = 8080;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    let file = fs.readFileSync("example.txt", "utf8");
    let arr = file.split(/\r?\n/);
    arr.forEach((line, idx) => {
        if (line.includes("2020-01-01")) {
            // console.log(idx + 1 + ":" + line);
            res.write(idx + 1 + ":" + line + "\n");
        }
    });
    res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server is started at port ${port}`);
});