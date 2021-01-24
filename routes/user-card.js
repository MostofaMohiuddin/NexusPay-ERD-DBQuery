const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-card-by-mob");
});

router.post("/", (req, res) => {
  console.log("Request: ", req.body);

  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql =
        "SELECT * FROM cards WHERE cards.user_id = (SELECT user_id FROM users WHERE mobile_no = $1 AND pin = $2)";
      const params = [req.body.mobileNo, req.body.pin];
      return client.query(sql, params);
    })
    .then(results => {
      console.log("results: ", results);
      res.render("user-card-by-mob", {
        cardInfo: results.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

module.exports = router;
