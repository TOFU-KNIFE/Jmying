import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
// Verify against the exact decoder shipped to the browser, not the encoder's
// package decoder. This also guards Three.js/bitstream version compatibility.
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { readGlb } from "./compress-model.mjs";

for (const name of ["archive-cassette", "archive-assembly"]) {
  test(`${name}: every geometry byte survives compression unchanged`, async () => {
    await MeshoptDecoder.ready;
    const source = readGlb(await readFile(`public/assets/${name}.glb`));
    const file = (await readdir("dist/assets")).find(
      (file) => file.startsWith(name + ".") && file.endsWith(".glb"),
    );
    const bytes = await readFile(`dist/assets/${file}`);
    const packed = readGlb(bytes);
    for (const key of ["accessors", "meshes", "materials", "nodes", "scenes"])
      assert.deepEqual(packed.json[key], source.json[key], key);
    for (const [i, view] of packed.json.bufferViews.entries()) {
      const ext = view.extensions.EXT_meshopt_compression;
      const restored = new Uint8Array(ext.count * ext.byteStride);
      MeshoptDecoder.decodeGltfBuffer(
        restored,
        ext.count,
        ext.byteStride,
        packed.bin.subarray(ext.byteOffset, ext.byteOffset + ext.byteLength),
        ext.mode,
      );
      const original = source.json.bufferViews[i];
      assert.deepEqual(
        Buffer.from(restored),
        source.bin.subarray(
          original.byteOffset ?? 0,
          (original.byteOffset ?? 0) + original.byteLength,
        ),
        `buffer view ${i}`,
      );
    }
    assert(
      bytes.length < (await readFile(`public/assets/${name}.glb`)).length * 0.7,
      "Reduce model transfer without reducing geometry",
    );
  });
}
