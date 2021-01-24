const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  console.log("Request: ", req.body);

  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = "SELECT * FROM users";
      return client.query(sql);
    })
    .then(results => {
      console.log("results: ", results);
      res.render("all-users", {
        userInfo: results.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

module.exports = router;
