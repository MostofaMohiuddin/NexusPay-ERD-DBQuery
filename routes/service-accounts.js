const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("service-accounts");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT C.card_no as payer_card, C.card_holder_name as payer_name, SA.service_account_type AS payees_acc_type, SA.service_acc AS payee_acc, T.amount AS amount
        FROM cards C, services_accounts SA, transactions T
        WHERE T.trx_id = $1
        AND C.card_no = T.payers_acc
        AND T.payees_acc = SA.services_account_id`;
    const params = [req.body.trxId];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("service-accounts", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
