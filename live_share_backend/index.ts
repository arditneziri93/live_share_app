import * as express from "express";
import * as cors from "cors"; // Required for cross-origin requests from client
const app = express();
const PORT = 3000;

// Enable CORS for all origins, or specify your client's origin
app.use(cors());

// SSE endpoint
app.get("/events", (req, res) => {
  // Set necessary headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests

  let counter = 0;

  // Function to send events
  const sendEvent = () => {
    counter++;
    const message = `Server sent message ${counter} at ${new Date().toLocaleTimeString()}`;

    // SSE data format: data: [your_message]\n\n
    res.write(`data: ${message}\n\n`);
    console.log(`Sent: ${message}`);
  };

  // Send an event every 3 seconds
  const intervalId = setInterval(sendEvent, 3000);

  // Clean up when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId); // Stop sending events to this client
    console.log("Client disconnected. Stopped sending events.");
    res.end(); // End the response
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(
    `Open http://localhost:${PORT} in your browser to see SSE in action.`
  );
});