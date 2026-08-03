import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only check for whether an image has actually been dropped into
 * public/media yet.
 *
 * The site has to look finished before the photographs exist, so every image
 * slot renders a designed placeholder until its file appears and swaps to the
 * real thing the moment it does. Rendering an <img> at a path that 404s would
 * leave a broken-image glyph on a portfolio, which is worse than no photo.
 */
export function hasMedia(fileName: string): boolean {
  try {
    return existsSync(path.join(process.cwd(), "public", "media", fileName));
  } catch {
    return false;
  }
}
