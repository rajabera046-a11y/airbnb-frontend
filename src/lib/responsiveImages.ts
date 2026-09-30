export function buildSrcSet(source: string, widths: number[]): string | undefined {
  try {
    const original = new URL(source);
    if (original.hostname !== "images.unsplash.com") return undefined;

    return widths
      .map((width) => {
        const candidate = new URL(original);
        candidate.searchParams.set("w", String(width));
        return `${candidate.toString()} ${width}w`;
      })
      .join(", ");
  } catch {
    return undefined;
  }
}
