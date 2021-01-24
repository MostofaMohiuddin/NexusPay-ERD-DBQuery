const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("new-transaction-mobiletopup");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT public.mobile_top_up(
        $1, 
        $2, 
        $3, 
        $4
    )`;
    const params = [
      req.body.user_id,
      req.body.card_no,
      req.body.amount,
      req.body.moop
    ];
    const services1 = await client.query(sql, params);
    console.log(services1.rowCount, services1.rows);

    res.render("new-transaction-mobiletopup", {
      userInfo: `${req.body.amount} recharged in ${req.body.mobileNo}`
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
