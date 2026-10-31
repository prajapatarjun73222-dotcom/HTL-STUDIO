const bcrypt = require("bcryptjs");
const { Admin, Settings, Service, GalleryItem } = require("./models");

function photo(id, width = 1400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

const ADMIN_EMAIL = "admin@fixhance.com";
const ADMIN_PASSWORD = "Fixhance@2026";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function dropLegacyIndex(model, name) {
  try {
    await model.collection.dropIndex(name);
  } catch {
    // The old index is already gone.
  }
}

async function seed() {
  const admin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ email: ADMIN_EMAIL, passwordHash });
  }

  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({
      studioName: "HTLSTUDIO by Maria",
      eyebrow: "Lewisham, London",
      headline: "Seamless length, quietly done.",
      introTitle: "Fitted by Maria, in Lee.",
      about:
        "HTLSTUDIO by Maria is a woman-owned extensions studio on Lee High Road. From a full-head removal to a precise tape re-glue, every treatment is unhurried and exact. Tape-ins, K-Tips and nano beads are fitted for length and volume that still move like your own hair.",
      workIntro:
        "We take care that extensions are applied as they are supposed to be done, with as natural a result as possible.",
      baIntro:
        "The moment the hair is finished, and the length looks as if it has always been theirs.",
      servicesIntro:
        "Three ways of adding hair, and the maintenance that keeps a set comfortable.",
      address: "53 Lee High Road, London, England",
      placeNote: "Nicole's Doll House, Lee",
      mapQuery: "53 Lee High Road, London, England",
      whatsapp: "447490161644",
      instagramHandle: "htlstudio",
      instagramPosts: 37,
      instagramFollowers: 165,
      instagramFollowing: 88,
      hours: days.map((day) => ({ day, open: "10:00 am", close: "11:00 pm" })),
      notes: ["Instant confirmation", "Parking available", "Near public transport", "Woman-owned"],
      paymentNote: "Klarna and Clearpay are available in the studio.",
      heroImage: photo("photo-1554519934-e32b1629d9ee", 1800),
      portraitImage: photo("photo-1605980766335-d3a41c7332a1", 1200),
    });
  }

  await applyHairPhotos();

  const serviceCount = await Service.countDocuments();
  const methodCount = await Service.countDocuments({ kind: "method" });
  if (serviceCount !== 9 || methodCount !== 3) {
    await dropLegacyIndex(Service, "slug_1");
    await Service.deleteMany({});
    await Service.insertMany([
      {
        name: "Nano beads extensions",
        duration: "",
        price: 0,
        kind: "method",
        description: "Tiny bonds placed close to the scalp, for a light, flexible fit.",
        imageUrl: photo("photo-1634449571017-5fecfd26ad76", 1000),
        order: 0,
      },
      {
        name: "K-Tips (keratin bonds)",
        duration: "",
        price: 0,
        kind: "method",
        description: "Keratin tips, discreet and secure, for a sleek finish.",
        imageUrl: photo("photo-1715067877702-9a3b0faf4ba3", 1000),
        order: 1,
      },
      {
        name: "Tape-ins",
        duration: "",
        price: 0,
        kind: "method",
        description: "Fine wefts between tape, quick to fit and gentle to remove.",
        imageUrl: photo("photo-1614020863825-28a0bb7e3c3c", 1000),
        order: 2,
      },
      {
        name: "Removal (full head)",
        duration: "2 hours",
        price: 75,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 3,
      },
      {
        name: "Removals + re-gluing of tapes (half head)",
        duration: "1 hour",
        price: 60,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 4,
      },
      {
        name: "50 grams fitting (half head)",
        duration: "1 hour 30 mins",
        price: 75,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 5,
      },
      {
        name: "Removal (half head)",
        duration: "1 hour",
        price: 50,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 6,
      },
      {
        name: "Removal + retipping (half head)",
        duration: "1 hour",
        price: 60,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 7,
      },
      {
        name: "Removal + re-gluing tapes (full head)",
        duration: "1 hour 20 mins",
        price: 75,
        kind: "treatment",
        description: "",
        imageUrl: "",
        order: 8,
      },
    ]);
  }

  const galleryCount = await GalleryItem.countDocuments({ kind: { $in: ["work", "pair"] } });
  if (galleryCount === 0) {
    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany([
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => ({
        kind: "work",
        imageUrl: `/instagram/${String(number).padStart(2, "0")}.jpg`,
        caption: "",
        order: number - 1,
      })),
      {
        kind: "pair",
        beforeUrl: photo("photo-1560264641-1b5191cc63e2", 900),
        afterUrl: photo("photo-1554519934-e32b1629d9ee", 900),
        caption: "Length through the ends",
        order: 9,
      },
      {
        kind: "pair",
        beforeUrl: photo("photo-1613323885593-5fbcf35bf8ba", 900),
        afterUrl: photo("photo-1605980625600-88b46abafa8d", 900),
        caption: "A softer wave",
        order: 10,
      },
      {
        kind: "pair",
        beforeUrl: photo("photo-1522337360788-8b13dee7a37e", 900),
        afterUrl: photo("photo-1605980766335-d3a41c7332a1", 900),
        caption: "A fuller length",
        order: 11,
      },
      {
        kind: "pair",
        beforeUrl: photo("photo-1715067877702-9a3b0faf4ba3", 900),
        afterUrl: photo("photo-1614020863825-28a0bb7e3c3c", 900),
        caption: "A smoother line",
        order: 12,
      },
    ]);
  }

  await polishExisting();
}

async function polishExisting() {
  const stale = await GalleryItem.exists({
    $or: [
      {
        imageUrl:
          /photo-1605497788044|photo-1595475884562|photo-1522337660859|photo-1560066984|photo-1521590832167/,
      },
      { beforeUrl: /photo-1494790108377|photo-1438761681033/ },
      { afterUrl: /photo-1529626455594/ },
    ],
  });
  if (!stale) return;

  const works = [
    ["Long, luminous blonde", "photo-1500917293891-ef795e70e1f6", "Long, luminous blonde"],
    ["Soft curl through the ends", "photo-1519699047748-de8e457a634e", "Soft curl through the ends"],
    ["A finish at the chair", "photo-1580618672591-eb180b1a973f", "A finish at the chair"],
    ["Warm colour, full length", "photo-1464863979621-258859e62245", "A darker, fuller length"],
    ["Tone blended through", "photo-1524504388940-b1c1722653e1", "A sleek finish"],
    ["The studio", "photo-1633681926022-84c23e8cb2d6", "The studio"],
    ["Care between appointments", "photo-1595476108010-b4d1f102b1b1", "Care between appointments"],
    ["A quiet chair", "photo-1522337360788-8b13dee7a37e", "Length from the crown"],
    ["Ready for a fitting", "photo-1562322140-8baeececf3df", "In the chair"],
  ];
  for (const [caption, id, nextCaption] of works) {
    await GalleryItem.updateOne({ kind: "work", caption }, { imageUrl: photo(id, 900), caption: nextCaption });
  }

  const pairs = [
    ["Length through the ends", "photo-1560264641-1b5191cc63e2", "photo-1554519934-e32b1629d9ee", "Length through the ends"],
    ["A softer wave", "photo-1613323885593-5fbcf35bf8ba", "photo-1605980625600-88b46abafa8d", "A softer wave"],
    ["A fuller length", "photo-1522337360788-8b13dee7a37e", "photo-1605980766335-d3a41c7332a1", "A fuller length"],
    ["A smoother line", "photo-1715067877702-9a3b0faf4ba3", "photo-1614020863825-28a0bb7e3c3c", "A smoother line"],
  ];
  for (const [caption, beforeId, afterId, nextCaption] of pairs) {
    await GalleryItem.updateOne(
      { kind: "pair", caption },
      { beforeUrl: photo(beforeId, 900), afterUrl: photo(afterId, 900), caption: nextCaption }
    );
  }

  await Service.updateOne(
    { name: "K-Tips (keratin bonds)" },
    { imageUrl: photo("photo-1715067877702-9a3b0faf4ba3", 1000) }
  );
  await Service.updateOne(
    { name: "Tape-ins" },
    { imageUrl: photo("photo-1614020863825-28a0bb7e3c3c", 1000) }
  );
}

async function applyHairPhotos() {
  await Settings.updateOne(
    { heroImage: /photo-1522337360788|photo-1519699047748|photo-1562322140/ },
    { $set: { heroImage: photo("photo-1554519934-e32b1629d9ee", 1800) } }
  );
  await Settings.updateOne(
    { portraitImage: /photo-1562322140|photo-1524504388940|photo-1494790108377/ },
    { $set: { portraitImage: photo("photo-1605980766335-d3a41c7332a1", 1200) } }
  );

  const methods = [
    ["Nano beads extensions", "photo-1634449571017-5fecfd26ad76"],
    ["K-Tips (keratin bonds)", "photo-1715067877702-9a3b0faf4ba3"],
    ["Tape-ins", "photo-1614020863825-28a0bb7e3c3c"],
  ];
  const oldMethod =
    /photo-1522337360788|photo-1524504388940|photo-1464863979621|photo-1605497788044|photo-1595476108010|photo-1562322140/;
  for (const [name, id] of methods) {
    await Service.updateOne({ name, imageUrl: oldMethod }, { $set: { imageUrl: photo(id, 1000) } });
  }

  const pairs = [
    ["Length through the ends", "photo-1560264641-1b5191cc63e2", "photo-1554519934-e32b1629d9ee"],
    ["A softer wave", "photo-1613323885593-5fbcf35bf8ba", "photo-1605980625600-88b46abafa8d"],
    ["A fuller length", "photo-1522337360788-8b13dee7a37e", "photo-1605980766335-d3a41c7332a1"],
    ["A smoother line", "photo-1715067877702-9a3b0faf4ba3", "photo-1614020863825-28a0bb7e3c3c"],
  ];
  const oldPair =
    /photo-1531746020798|photo-1488426862026|photo-1524504388940|photo-1580618672591|photo-1494790108377|photo-1519699047748|photo-1500917293891|photo-1464863979621/;
  for (const [caption, beforeId, afterId] of pairs) {
    await GalleryItem.updateOne(
      { kind: "pair", caption, beforeUrl: oldPair },
      { $set: { beforeUrl: photo(beforeId, 900), afterUrl: photo(afterId, 900) } }
    );
  }
  await GalleryItem.updateOne(
    { kind: "pair", caption: "Length through the ends", afterUrl: /photo-1560869713-bf165a9cfac1/ },
    { $set: { afterUrl: photo("photo-1554519934-e32b1629d9ee", 900) } }
  );
}

module.exports = { seed };
