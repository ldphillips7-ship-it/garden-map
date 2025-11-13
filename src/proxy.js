// proxy-server.js (root level)
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/plant", async (req, res) => {
  const { name } = req.query;
  const token = "usr-vOFEHCbW_Bh7_tk0vY8jMFp8LYb62TSFGV4eDzgLmmU";

  try {
    const response = await axios.get("https://trefle.io/api/v1/plants/search", {
      params: { token, q: name },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from Trefle:", error.message);
    res.status(500).json({ error: "Failed to fetch plant data" });
  }
});

const PORT = 5050;
app.listen(PORT, () =>
  console.log(`🌿 Proxy server running on http://localhost:${PORT}`)
);