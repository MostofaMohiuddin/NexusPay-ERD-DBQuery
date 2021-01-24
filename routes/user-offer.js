const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-offer");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT *
    FROM offers
    WHERE loyalty_points_card_no = (
      SELECT card_no
      FROM cards
      WHERE user_id = (
        SELECT user_id
        FROM users
        WHERE mobile_no = $1
          AND pin = $2 )
      AND card_type = 'LOYALTY POINTS CARD' );`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-offer", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
