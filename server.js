const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const app = express();

const mustache = mustacheExpress();
mustache.cache = null;
app.engine("mustache", mustache);
app.set("view engine", "mustache");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// ******* Import & Use Routes *******
const query = require("./routes/query");
const user = require("./routes/user");
const users = require("./routes/users");
const user_card = require("./routes/user-card");
const user_service = require("./routes/user-service");
const service_accounts = require("./routes/service-accounts");
const user_creditcard = require("./routes/user-creditcard");
const user_card_balance = require("./routes/user-card-balance");
const user_offer = require("./routes/user-offer");
const user_virtual_card = require("./routes/user-virtual-card");
const user_biller = require("./routes/user-biller");
const user_ministatement = require("./routes/user-ministatement");
const new_user = require("./routes/new-user");
const new_card = require("./routes/new-card");
const new_card_debit = require("./routes/new-card-debit");
const new_transaction_mobiletopup = require("./routes/new-transaction-mobiletopup");

app.use("/query", query);
app.use("/user", user);
app.use("/users", users);
app.use("/user/card", user_card);
app.use("/user/service", user_service);
app.use("/service/accounts", service_accounts);
app.use("/user/creditcard", user_creditcard);
app.use("/user/card/balance", user_card_balance);
app.use("/user/offer", user_offer);
app.use("/user/virtual-card", user_virtual_card);
app.use("/user/biller", user_biller);
app.use("/user/ministatement", user_ministatement);
app.use("/new/user", new_user);
app.use("/new/card", new_card);
app.use("/new/card/debit", new_card_debit);
app.use("/new/transaction/mobiletopup", new_transaction_mobiletopup);

// ******* Running Server *******
const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`Listening to port: ${port}...`);
});
