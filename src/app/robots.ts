import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/catalog"],
      },
    ],
    sitemap: "https://bizarrejapan.com/sitemap.xml",
    host: "https://bizarrejapan.com",
  };
}
