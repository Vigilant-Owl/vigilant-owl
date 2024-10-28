const express = require("express");
require("dotenv").config();

const app = express();

const router = require("./routes");

app.use(router);

const PORT = process.env.PORT || 8000;

const whatsAppClient = require("./services/whatsapp.service");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
