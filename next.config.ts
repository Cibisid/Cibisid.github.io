import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is prerendered HTML/CSS/JS with no server,
  // which is what GitHub Pages serves. The two interactive panels are client
  // components, so they hydrate and work exactly the same way.
  output: "export",

  // Pages has no image optimisation server, so next/image has to emit plain
  // <img> tags rather than requesting /_next/image at runtime.
  images: { unoptimized: true },

  // Emit about/index.html rather than about.html, so paths resolve without
  // relying on the host's extension-guessing.
  trailingSlash: true,
};

export default nextConfig;
