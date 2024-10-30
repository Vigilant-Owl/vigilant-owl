try {
  const express = require("express");
  const cors = require("cors");

  require("dotenv").config();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const router = require("./routes");

  app.use("/api", router);

  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  const PORT = process.env.PORT || 8000;

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  require("./services");

  server.on("upgrade", (request, socket, head) => {
    global.wsServer.handleUpgrade(request, socket, head, (ws) => {
      global.wsServer.emit("connection", ws, request);
    });
  });
} catch (err) {
  console.error(err);
}
