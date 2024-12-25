const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

// Endpoint to get data.json
app.get("/api/data", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data file" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint to update data.json
app.post("/api/data", (req, res) => {
  const updatedData = req.body;
  fs.writeFile("data.json", JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to update data file" });
    } else {
      res.json({ success: true, message: "Data updated successfully" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
