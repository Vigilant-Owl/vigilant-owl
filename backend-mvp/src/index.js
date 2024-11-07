try {
  const express = require("express");
  const cors = require("cors");

  require("dotenv").config();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static("public"));

  require("./services");

  const router = require("./routes");

  app.use("/api", router);

  app.get("/check", (req, res) => {
    res.send(Buffer.from("Server is running!"));
  });

  app.get("/", (req, res) => {
    res.send("<h1>This is backend server for vigilant owl.</h2>");
  });

  const PORT = process.env.PORT || 8000;

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on("upgrade", (request, socket, head) => {
    global.wsServer.handleUpgrade(request, socket, head, (ws) => {
      global.wsServer.emit("connection", ws, request);
    });
  });
} catch (err) {
  console.error(err);
}
