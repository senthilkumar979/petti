// Script to update manifest.json with proper icon references

const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const manifestPath = path.join(publicDir, "manifest.json");

// Read current manifest
let manifest;
try {
  const manifestContent = fs.readFileSync(manifestPath, "utf8");
  manifest = JSON.parse(manifestContent);
} catch (error) {
  console.error("❌ Error reading manifest.json:", error.message);
  process.exit(1);
}

// Update icons array with proper PNG references
manifest.icons = [
  {
    src: "/icon-72.png",
    sizes: "72x72",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-96.png",
    sizes: "96x96",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-128.png",
    sizes: "128x128",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-144.png",
    sizes: "144x144",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-152.png",
    sizes: "152x152",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-180.png",
    sizes: "180x180",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-384.png",
    sizes: "384x384",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
];

// Write updated manifest
try {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Updated manifest.json with proper icon references");
  console.log("📱 Icons configured for PWA installation");
} catch (error) {
  console.error("❌ Error writing manifest.json:", error.message);
  process.exit(1);
}

console.log("\n🎯 PWA Icons Setup Complete!");
console.log("📱 Your app now uses your logo.png for PWA icons");
console.log("🔧 Test PWA installation on mobile devices");
