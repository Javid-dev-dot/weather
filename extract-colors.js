const sharp = require("sharp");
const path = require("path");

const files = [
  "public/Weather App Design Inspiration_ on Behance.jpg",
  "public/Day and night switch buttons _ Premium Vector.jpg",
  "public/Fashion for Extreme Weather Conditions.jpg",
  "public/download (2).jpg",
  "public/download (3).jpg",
];

(async () => {
  for (const f of files) {
    try {
      const full = path.join(__dirname, f);
      const meta = await sharp(full).metadata();
      const { data, info } = await sharp(full)
        .resize(120, 120)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const colors = {};
      for (let i = 0; i < data.length; i += info.channels) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        if (!colors[key]) colors[key] = { r, g, b, count: 0 };
        colors[key].count++;
      }

      const top = Object.values(colors)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      console.log(`\n=== ${f} (${meta.width}x${meta.height}) ===`);
      top.forEach((c) => {
        const hex = "#" + [c.r, c.g, c.b].map((x) => Math.min(255, x).toString(16).padStart(2, "0")).join("");
        const pct = ((c.count / (120 * 120)) * 100).toFixed(1);
        console.log(`  ${hex}  ${pct}%  rgb(${c.r},${c.g},${c.b})`);
      });
    } catch (e) {
      console.log(f + " ERROR: " + e.message);
    }
  }
})();
