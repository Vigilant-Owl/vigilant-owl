const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser);

const router = require("./routes");

app.use("/api", router);

const PORT = process.env.PORT || 8000;

// require("./services/whatsapp/whatsapp.service");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
