const express = require("express");
const app = express();

const router = require("./routes");

app.use(router);

const PORT = process.env.PORT || 3000;

require("./services/whatsapp.service");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
