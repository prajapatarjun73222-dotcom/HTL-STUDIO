const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
});

const hourSchema = new mongoose.Schema(
  {
    day: String,
    open: String,
    close: String,
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    studioName: { type: String, default: "HTLSTUDIO by Maria" },
    eyebrow: { type: String, default: "Lewisham, London" },
    headline: { type: String, default: "" },
    introTitle: { type: String, default: "" },
    about: { type: String, default: "" },
    workIntro: { type: String, default: "" },
    baIntro: { type: String, default: "" },
    servicesIntro: { type: String, default: "" },
    address: { type: String, default: "" },
    placeNote: { type: String, default: "" },
    mapQuery: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    instagramHandle: { type: String, default: "" },
    instagramPosts: { type: Number, default: 0 },
    instagramFollowers: { type: Number, default: 0 },
    instagramFollowing: { type: Number, default: 0 },
    hours: { type: [hourSchema], default: [] },
    notes: { type: [String], default: [] },
    paymentNote: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    portraitImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, default: "" },
    price: { type: Number, default: 0 },
    kind: { type: String, enum: ["method", "treatment"], default: "treatment" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const gallerySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["work", "pair"], required: true },
    imageUrl: { type: String, default: "" },
    beforeUrl: { type: String, default: "" },
    afterUrl: { type: String, default: "" },
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
const Settings = mongoose.model("Settings", settingsSchema);
const Service = mongoose.model("Service", serviceSchema);
const GalleryItem = mongoose.model("GalleryItem", gallerySchema);

module.exports = { Admin, Settings, Service, GalleryItem };
