import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { hasPublishedWork } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    // /work 404s while the portfolio is empty, so it must not be listed.
    ...(hasPublishedWork
      ? [
          {
            url: `${site.url}/work`,
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]
      : []),
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${site.url}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
