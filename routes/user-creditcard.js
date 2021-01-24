const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-creditcard");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT C.card_no AS card_no, C.card_holder_name AS c_h_name, C.card_type AS card_type, C.card_expiry_date AS exp_date, card_cvc, balance, loan_limit, loan_pending, bill_date, interest
    FROM cards C, dbbl_credit_cards DCC
    WHERE C.card_no = DCC.card_no
      AND C.user_id = (
        SELECT user_id
        FROM users
        WHERE mobile_no = $1
        AND pin = $2 );`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-creditcard", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
