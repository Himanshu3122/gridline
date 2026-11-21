// Publication settings. Change the name, tagline and URL here.

export const site = {
  name: "Gridline",
  tagline: "Where AI compute meets the power grid",
  url: "https://himanshu3122.github.io/gridline",
  description:
    "Technical analysis of AI infrastructure, data center power, smart grids and multi-agent AI systems, with the models and math behind the news.",
};

// Sub-path the site is served from (must match basePath in next.config.mjs).
// Needed for plain <a> links, which Next.js does not prefix automatically.
export const basePath = "/gridline";

export type Category = { slug: string; name: string; description: string };

export const categories: Category[] = [
  {
    slug: "ai-infrastructure",
    name: "AI Infrastructure",
    description: "Data centers, GPU clusters and the energy cost of running AI.",
  },
  {
    slug: "smart-grid",
    name: "Smart Grid",
    description: "Grid stability, EVs, V2G and what new loads do to the power system.",
  },
  {
    slug: "multi-agent-ai",
    name: "Multi-Agent AI",
    description: "Reliability, latency and cost of systems built from many AI agents.",
  },
  {
    slug: "explainers",
    name: "Explainers",
    description: "The math and models behind the headlines, explained with code.",
  },
];

export const categoryByName = (name: string) => categories.find((c) => c.name === name);
