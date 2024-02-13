// Basic command-line example
// Usage: node save-as-png.js
const fs = require("fs");
const trianglify = require("trianglify");

// Generate a pattern and then grab the PNG data uri
const canvas = trianglify({
  width: 2560,
  height: 1440,
  cellSize: 250,
  xColors: ["#edb506", "#55534d"],
  variance: 0.8,
  seed: 150,
}).toSVGTree();

console.log(canvas.toString());
// Save the buffer to a file. See the node-canvas docs for a full
// list of all the things you can do with this Canvas object:
// https://github.com/Automattic/node-canvas
// const file = fs.createWriteStream("trianglify.svg");
// canvas.createPNGStream().pipe(file);

// run with node background.ts
