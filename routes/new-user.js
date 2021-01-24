const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("new-user");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `INSERT INTO public.users(
        username, email, mobile_no, mobile_operator, pin)
        VALUES ($1, $2, $3, $4, $5);`;
    const params = [
      req.body.username,
      req.body.email,
      req.body.mobileNo,
      req.body.moop,
      req.body.pin
    ];
    const services1 = await client.query(sql, params);
    console.log(services1.rowCount, services1.rows);

    const sql2 = `SELECT C.card_no AS card_no, C.card_holder_name AS card_holder_name, C.card_expiry_date AS card_expiry_date, LPC.virtual_card_no AS virtual_card_no
        FROM cards C, loyalty_points_cards LPC
        WHERE C.user_id = (
        SELECT user_id
        FROM users
        WHERE mobile_no = $1
        AND pin = $2
        )
        AND C.card_no = LPC.card_no
        AND card_type = 'LOYALTY POINTS CARD'`;
    const params2 = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql2, params2);
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
