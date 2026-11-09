import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { waitForOptionalAssets } from "../src/startup-assets.ts";

test("missing optional fonts do not fail archive startup", async () => {
  await assert.doesNotReject(
    waitForOptionalAssets(
      [Promise.resolve(), Promise.reject(new Error("font unavailable"))],
      20,
    ),
  );
});
test("a permanently pending font cannot hold startup", async () => {
  const usable = await Promise.race([
    waitForOptionalAssets([new Promise(() => {})], 10).then(() => true),
    delay(500).then(() => false),
  ]);
  assert.equal(usable, true);
});
