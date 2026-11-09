import assert from "node:assert/strict";
import { MeshoptEncoder } from "meshoptimizer/encoder";

const EXT = "EXT_meshopt_compression";
export function readGlb(bytes) {
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLength = bytes.readUInt32LE(12);
  assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
  const binOffset = 20 + jsonLength;
  assert.equal(bytes.readUInt32LE(binOffset + 4), 0x004e4942);
  return {
    json: JSON.parse(bytes.subarray(20, binOffset).toString()),
    bin: bytes.subarray(
      binOffset + 8,
      binOffset + 8 + bytes.readUInt32LE(binOffset),
    ),
  };
}

// Lossless storage only: no quantization, simplification, vertex/triangle
// reordering, material edits or changes to authoring files. INDICES preserves
// the exact index sequence (including each triangle's first vertex).
export async function compressGlb(bytes) {
  await MeshoptEncoder.ready;
  const { json, bin } = readGlb(bytes);
  assert.equal(json.buffers.length, 1);
  assert(!json.buffers[0].uri);
  const parts = [];
  let offset = 0;
  json.bufferViews.forEach((view, index) => {
    assert.equal(view.buffer, 0);
    assert(!view.extensions);
    const accessor = json.accessors.find((item) => item.bufferView === index);
    assert(accessor && !accessor.sparse && !accessor.byteOffset);
    const mode = view.target === 34963 ? "INDICES" : "ATTRIBUTES";
    const stride = view.byteStride ?? view.byteLength / accessor.count;
    assert(Number.isInteger(stride) && stride > 0);
    const original = bin.subarray(
      view.byteOffset ?? 0,
      (view.byteOffset ?? 0) + view.byteLength,
    );
    const compressed = Buffer.from(
      MeshoptEncoder.encodeGltfBuffer(
        original,
        view.byteLength / stride,
        stride,
        mode,
      ),
    );
    view.buffer = 1;
    view.extensions = {
      [EXT]: {
        buffer: 0,
        byteOffset: offset,
        byteLength: compressed.length,
        byteStride: stride,
        count: view.byteLength / stride,
        mode,
      },
    };
    parts.push(compressed, Buffer.alloc((4 - (compressed.length % 4)) % 4));
    offset += compressed.length + ((4 - (compressed.length % 4)) % 4);
  });
  json.buffers = [
    { byteLength: offset },
    {
      byteLength: json.buffers[0].byteLength,
      extensions: { [EXT]: { fallback: true } },
    },
  ];
  json.extensionsUsed = [...new Set([...(json.extensionsUsed ?? []), EXT])];
  json.extensionsRequired = [
    ...new Set([...(json.extensionsRequired ?? []), EXT]),
  ];
  const text = Buffer.from(JSON.stringify(json));
  const padded = Buffer.concat([
    text,
    Buffer.alloc((4 - (text.length % 4)) % 4, 0x20),
  ]);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + padded.length + offset, 8);
  header.writeUInt32LE(padded.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(offset, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, padded, binaryHeader, ...parts]);
}
