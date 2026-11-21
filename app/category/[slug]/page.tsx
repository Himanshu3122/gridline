import type { Metadata } from "next";
import PostRow from "@/components/PostRow";
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
      <header className="page-head">
        <div className="container">
          <p className="kicker">Section</p>
          <h1>{c.name}</h1>
          <p>{c.description}</p>
        </div>
      </header>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {posts.length ? (
            <div className="river" style={{ maxWidth: 860 }}>
              {posts.map((p) => (
                <PostRow key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <p className="muted">No stories in this section yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
