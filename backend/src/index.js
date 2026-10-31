require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connect, redact } = require("./db");
const { seed } = require("./seed");
const { requireAuth } = require("./middleware/auth");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", requireAuth, adminRoutes);
app.use("/api", publicRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: "Something went wrong" });
  console.error(redact(err && err.message));
});

async function main() {
  await connect();
  await seed();
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`HTLSTUDIO API listening on ${port}`);
  });
}

main().catch((err) => {
  console.error("HTLSTUDIO API failed to start");
  console.error(redact(err && err.message));
  process.exit(1);
});
