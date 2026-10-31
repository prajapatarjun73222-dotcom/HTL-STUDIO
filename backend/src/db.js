const mongoose = require("mongoose");

function redact(value) {
  return String(value || "").replace(/mongodb(\+srv)?:\/\/\S+/gi, "mongodb://***");
}

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
  } catch (err) {
    throw new Error(redact(err.message));
  }
}

module.exports = { connect, redact };
