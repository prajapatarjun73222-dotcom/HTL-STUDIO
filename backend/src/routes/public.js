const express = require("express");
const { Settings, Service, GalleryItem } = require("../models");

const router = express.Router();

router.get("/settings", async (_req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
});

router.get("/services", async (_req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: 1 });
  res.json(services);
});

router.get("/gallery", async (_req, res) => {
  const gallery = await GalleryItem.find().sort({ order: 1, createdAt: 1 });
  res.json(gallery);
});

module.exports = router;
