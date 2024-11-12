const WebSocket = require("ws");
const fs = require("fs");

global.wsServer = new WebSocket.Server({
  noServer: true,
});

global.wsServer.on("connection", (ws) => {
  console.log("New client connected");

  // Handle incoming messages
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type == "qrcode") {
        const filePath = "storage/qrcodes/last.qr";

        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error("Error reading QR code file:", err);
            ws.send("Error reading QR code file");
            return;
          }

          let sendData = {
            type: "qrcode",
            qrCode: data.toString(),
          };
          console.log(sendData);
          ws.send(JSON.stringify(sendData));
        });
      }
      console.log("Received message:", data);

      // Broadcast the message to all connected clients
      // wsServer.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(msg.toString());
      //   }
      // });
    } catch (err) {
      console.error(err);
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
