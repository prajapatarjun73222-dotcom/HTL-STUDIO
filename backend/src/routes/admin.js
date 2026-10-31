const express = require("express");
const { Settings, Service, GalleryItem } = require("../models");

const router = express.Router();

const settingFields = [
  "studioName",
  "eyebrow",
  "headline",
  "introTitle",
  "about",
  "workIntro",
  "baIntro",
  "servicesIntro",
  "address",
  "placeNote",
  "mapQuery",
  "whatsapp",
  "instagramHandle",
  "instagramPosts",
  "instagramFollowers",
  "instagramFollowing",
  "hours",
  "notes",
  "paymentNote",
  "heroImage",
  "portraitImage",
];

function pickSettings(body) {
  const update = {};
  for (const key of settingFields) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  if (update.instagramPosts !== undefined) update.instagramPosts = Number(update.instagramPosts) || 0;
  if (update.instagramFollowers !== undefined) update.instagramFollowers = Number(update.instagramFollowers) || 0;
  if (update.instagramFollowing !== undefined) update.instagramFollowing = Number(update.instagramFollowing) || 0;
  if (update.instagramHandle) update.instagramHandle = String(update.instagramHandle).replace(/^@/, "");
  if (Array.isArray(update.notes)) {
    update.notes = update.notes.map((note) => String(note).trim()).filter(Boolean);
  }
  return update;
}

function servicePayload(body) {
  const kind = body.kind === "method" ? "method" : "treatment";
  return {
    name: String(body.name || "").trim(),
    duration: String(body.duration || "").trim(),
    price: Number(body.price) || 0,
    kind,
    description: String(body.description || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
  };
}

function galleryPayload(body) {
  const kind = body.kind === "pair" ? "pair" : "work";
  return {
    kind,
    imageUrl: String(body.imageUrl || "").trim(),
    beforeUrl: String(body.beforeUrl || "").trim(),
    afterUrl: String(body.afterUrl || "").trim(),
    caption: String(body.caption || "").trim(),
  };
}

async function reorder(Model, ids) {
  await Promise.all(ids.map((id, index) => Model.findByIdAndUpdate(id, { order: index })));
  return Model.find().sort({ order: 1, createdAt: 1 });
}

router.put("/settings", async (req, res) => {
  const update = pickSettings(req.body || {});
  const settings = await Settings.findOneAndUpdate({}, update, { new: true });
  if (!settings) return res.status(404).json({ message: "Studio details are not ready yet" });
  return res.json(settings);
});

router.post("/services", async (req, res) => {
  const payload = servicePayload(req.body || {});
  if (!payload.name) return res.status(400).json({ message: "A service needs a name" });
  const last = await Service.findOne().sort({ order: -1 });
  const service = await Service.create({ ...payload, order: last ? last.order + 1 : 0 });
  return res.status(201).json(service);
});

router.put("/services/:id", async (req, res) => {
  const payload = servicePayload(req.body || {});
  if (!payload.name) return res.status(400).json({ message: "A service needs a name" });
  const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  return res.json(service);
});

router.delete("/services/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  return res.json({ ok: true });
});

router.post("/services/reorder", async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  const services = await reorder(Service, ids);
  return res.json(services);
});

router.post("/gallery", async (req, res) => {
  const payload = galleryPayload(req.body || {});
  const last = await GalleryItem.findOne().sort({ order: -1 });
  const item = await GalleryItem.create({ ...payload, order: last ? last.order + 1 : 0 });
  return res.status(201).json(item);
});

router.put("/gallery/:id", async (req, res) => {
  const payload = galleryPayload(req.body || {});
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!item) return res.status(404).json({ message: "Photograph not found" });
  return res.json(item);
});

router.delete("/gallery/:id", async (req, res) => {
  await GalleryItem.findByIdAndDelete(req.params.id);
  return res.json({ ok: true });
});

router.post("/gallery/reorder", async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  const gallery = await reorder(GalleryItem, ids);
  return res.json(gallery);
});

module.exports = router;
