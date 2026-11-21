import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  readingMinutes: number;
};

export type Heading = { id: string; text: string; level: number };
export type Post = PostMeta & { html: string; headings: Heading[] };

function readFile(file: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    dek: String(data.dek ?? ""),
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    category: String(data.category ?? "Explainers"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => readFile(f).meta)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post> {
  const file = fs.existsSync(path.join(POSTS_DIR, `${slug}.md`)) ? `${slug}.md` : `${slug}.mdx`;
  const { meta, content } = readFile(file);

  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: "wrap" })
      .use(rehypeKatex)
      .use(rehypeHighlight, { detect: false })
      .use(rehypeStringify)
      .process(content)
  );

  // Build the table of contents from the rendered h2/h3 ids so anchors always match.
  const headings: Heading[] = [];
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    headings.push({ level: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, "").trim() });
  }

  return { ...meta, html, headings };
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
