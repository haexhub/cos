const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const port = 8765;
const Gun = require("gun");

const httpsOptions = {
  key: fs.readFileSync("./cert.key"),
  cert: fs.readFileSync("./cert.pem"),
};
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log("server running at " + port);
});

/* const server = require("http").createServer().listen(8765); */
const gun = Gun({ web: server });

app.get("/", (req, res) => {
  res.send("IT'S WORKING!11" + JSON.stringify(gun));
});
