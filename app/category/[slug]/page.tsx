import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { categories } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug)!;
  return { title: c.name, description: c.description };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug)!;
  const posts = getAllPosts().filter((p) => p.category === c.name);

  return (
    <>
      <header className="page-head" data-cat={c.slug}>
        <div className="container reveal">
          <p className="kicker">
            Section · {posts.length} {posts.length === 1 ? "story" : "stories"}
          </p>
          <h1>{c.name}</h1>
          <p>{c.description}</p>
        </div>
      </header>
      <section className="container cta-wrap">
        {posts.length ? (
          <div className="card-grid">
            {posts.map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <p className="muted">No stories in this section yet.</p>
        )}
      </section>
    </>
  );
}
