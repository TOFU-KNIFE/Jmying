/** Optional visual assets must never prevent the archive from becoming usable. */
export async function waitForOptionalAssets(
  assets: Promise<unknown>[],
  budgetMs = 2500,
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.allSettled(assets),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, budgetMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
