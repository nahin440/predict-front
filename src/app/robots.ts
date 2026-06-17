import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://goldpredict.ai";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/predictions", "/pricing", "/blog", "/about", "/gold-price-forecast", "/gold-market-analysis"],
        disallow: ["/admin", "/dashboard", "/api/", "/auth/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
