const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-ministatement");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT U.username AS u_name, T.payers_acc AS payer_acc, SA.service_account_type AS payee_acc_type,
        SA.service_acc AS payee_acc_no, T.amount AS amount, SUBSTR(CAST(T.timestamp AS varchar), 1, 19) AS trx_time
        FROM users_mini_statement UMS, users U, transactions T, services_accounts SA
        WHERE U.mobile_no = $1
        AND U.pin = $2
        AND U.user_id = UMS.user_id
        AND UMS.trx_id = T.trx_id
        AND SA.services_account_id = T.payees_acc;`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-ministatement", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
