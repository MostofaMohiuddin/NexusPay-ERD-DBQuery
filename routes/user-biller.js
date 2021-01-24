const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("user-biller");
});

router.post("/", async (req, res) => {
  try {
    console.log("Request: ", req.body);

    const client = new Client();
    await client.connect();

    const sql = `SELECT U.user_id as u_id , U.username as u_name, U.mobile_no as u_mobile, B.biller_name
                    as b_name, UB.biller_nick_name as b_nick_name, B.account_no as b_acc
                FROM users U, user_specific_billers UB, biller_accounts B
                WHERE U.mobile_no = $1
                    AND U.pin = $2
                    AND UB.user_id = U.user_id
                    AND UB.biller_name = B.biller_name;`;
    const params = [req.body.mobileNo, req.body.pin];
    const services = await client.query(sql, params);
    console.log(services.rowCount, services.rows);

    res.render("user-biller", {
      userInfo: services.rows
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  }
});

module.exports = router;
