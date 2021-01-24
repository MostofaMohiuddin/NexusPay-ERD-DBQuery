const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("new-card-credit");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT public.add_dbbl_credit_card(
        $1, 
        $2, 
        $3
    )`;
    const params = [req.body.id, req.body.card, req.body.cvc];
    const services2 = await client.query(sql, params);
    console.log(services2.rowCount, services2.rows);

    const sql2 = `select * from cards where user_id = $1`;
    const params2 = [req.body.id];
    const services = await client.query(sql2, params2);
    console.log(services.rowCount, services.rows);

    res.render("new-card-debit", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
