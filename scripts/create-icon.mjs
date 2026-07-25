import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const size = 64;
const maskStride = Math.ceil(size / 32) * 4;
const pixelBytes = size * size * 4;
const maskBytes = maskStride * size;
const dibBytes = 40 + pixelBytes + maskBytes;
const fileBytes = 6 + 16 + dibBytes;
const outputPath = fileURLToPath(new URL('../src-tauri/icons/icon.ico', import.meta.url));
const buffer = Buffer.alloc(fileBytes);

let offset = 0;

function writeUInt16(value) {
  buffer.writeUInt16LE(value, offset);
  offset += 2;
}

function writeUInt32(value) {
  buffer.writeUInt32LE(value, offset);
  offset += 4;
}

function writeInt32(value) {
  buffer.writeInt32LE(value, offset);
  offset += 4;
}

writeUInt16(0);
writeUInt16(1);
writeUInt16(1);

buffer[offset++] = size;
buffer[offset++] = size;
buffer[offset++] = 0;
buffer[offset++] = 0;
writeUInt16(1);
writeUInt16(32);
writeUInt32(dibBytes);
writeUInt32(22);

writeUInt32(40);
writeInt32(size);
writeInt32(size * 2);
writeUInt16(1);
writeUInt16(32);
writeUInt32(0);
writeUInt32(pixelBytes + maskBytes);
writeInt32(0);
writeInt32(0);
writeUInt32(0);
writeUInt32(0);

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function isInGlyph(x, y) {
  const vertical = x >= 18 && x <= 25 && y >= 15 && y <= 49;
  const top = x >= 22 && x <= 39 && y >= 15 && y <= 22;
  const bottom = x >= 22 && x <= 39 && y >= 42 && y <= 49;
  const rightArc = x >= 37 && x <= 47 && y >= 23 && y <= 41;
  return vertical || top || bottom || rightArc;
}

for (let y = size - 1; y >= 0; y -= 1) {
  for (let x = 0; x < size; x += 1) {
    const dx = x - 31.5;
    const dy = y - 31.5;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const inside = distance <= 30;
    const intensity = 1 - Math.min(distance / 30, 1);
    const glyph = isInGlyph(x, y);

    const red = glyph ? 248 : 21 + 66 * intensity + x * 0.35;
    const green = glyph ? 250 : 96 + 145 * intensity;
    const blue = glyph ? 252 : 168 + 72 * intensity + y * 0.2;
    const alpha = inside ? 255 : 0;

    buffer[offset++] = clampChannel(blue);
    buffer[offset++] = clampChannel(green);
    buffer[offset++] = clampChannel(red);
    buffer[offset++] = alpha;
  }
}

offset += maskBytes;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, buffer);
console.log(`Wrote ${outputPath}`);
