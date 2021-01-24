const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-card-balance");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `( SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_type AS card_type, C.card_expiry_date AS exp_date, LPC.balance as balance
        FROM cards C, loyalty_points_cards LPC
        WHERE C.user_id = (SELECT U.user_id FROM users U WHERE mobile_no = $1 AND pin = $2)
          AND C.card_no = LPC.card_no )
      UNION
      ( SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_type AS card_type, C.card_expiry_date AS exp_date, DA.balance AS balance
        FROM cards C, dbbl_debit_cards DBC, dbbl_accounts DA
        WHERE C.user_id = (SELECT U.user_id FROM users U WHERE mobile_no = $1 AND pin = $2)
          AND C.card_no = DBC.card_no
          AND DBC.card_no = DA.card_no )
      UNION
      ( SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_type AS card_type, C.card_expiry_date AS exp_date, DCC.balance AS balance
        FROM cards C, dbbl_credit_cards DCC
        WHERE C.user_id = (SELECT U.user_id FROM users U WHERE mobile_no = $1 AND pin = $2)
          AND DCC.card_no = C.card_no )
      UNION
      ( SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_type AS card_type, C.card_expiry_date AS exp_date, RA.balance AS balance
        FROM cards C, rocket_cards RC, rocket_accounts RA
        WHERE C.user_id = (SELECT U.user_id FROM users U WHERE mobile_no = $1 AND pin = $2)
          AND C.card_no = RC.card_no
          AND RC.mobile_no = RA.mobile_no );`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-card-balance", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
