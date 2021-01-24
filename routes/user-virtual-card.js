const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-virtual-card");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_expiry_date AS card_expiry_date, LPC.virtual_card_no AS virtual_card_no
        FROM cards C, loyalty_points_cards LPC
        WHERE C.user_id = (
        SELECT user_id
        FROM users
        WHERE mobile_no = $1
        AND pin = $2
        )
        AND C.card_no = LPC.card_no
        AND card_type = 'LOYALTY POINTS CARD'`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-virtual-card", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
