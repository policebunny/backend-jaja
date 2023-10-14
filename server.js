const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = process.env.PORT || 8080;
const filename = __dirname + "/barcode.json";
//Middleware
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
app.use(express.json()); //for parsing application/json

function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);
//Endpoints   mehrere
app.get("/barcode", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    });
});
//spezifisch einen holen
app.get("/barcode/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        const dataAsObject = JSON.parse(data)[req.params.id];
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(JSON.stringify(dataAsObject));
    });
});
//
app.put("/barcode/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject[req.params.id].data = req.body.data;
        dataAsObject[req.params.id].timestamp = req.body.timestamp;
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});
app.delete("/barcode/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.splice(req.params.id, 1);
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});
app.post("/barcode", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.push({
            id: dataAsObject.length,
             data: req.body.data,
             timestamp: req.body.timestamp
          
        });
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));