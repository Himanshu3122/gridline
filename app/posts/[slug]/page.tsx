import type { Metadata } from "next";
import Link from "next/link";
import PostCover from "@/components/PostCover";
import { categoryByName, site } from "@/lib/data";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/posts/${slug}/` },
    openGraph: { type: "article", title: post.title, description: post.dek, publishedTime: post.date, tags: post.tags },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  const all = getAllPosts();
  const cat = categoryByName(post.category);
  const related = all.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const more = related.length ? related : all.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: site.name },
    url: `${site.url}/posts/${slug}/`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container">
        <header className="article-head">
          <div className="meta">
            {cat ? (
              <Link href={`/category/${cat.slug}/`} className="cat">
                {cat.name}
              </Link>
            ) : (
              <span className="cat">{post.category}</span>
            )}
            <span>{formatDate(post.date)}</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1>{post.title}</h1>
          {post.dek && <p className="article-dek">{post.dek}</p>}
        </header>

        <PostCover slug={post.slug} category={post.category} className="article-cover" label={false} />

        <div className="article-layout">
          <div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.tags.length > 0 && (
              <div className="tags" style={{ marginTop: 48 }}>
                {post.tags.map((t) => (
                  <span key={t} className="tag">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.headings.length > 1 && (
            <aside className="toc" aria-label="On this page">
              <p className="kicker">On this page</p>
              <ol>
                {post.headings.map((h) => (
                  <li key={h.id} className={`lvl-${h.level}`}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section className="section read-next">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">Read next</p>
                <h2>More from {related.length ? post.category : site.name}</h2>
              </div>
            </div>
            <div className="card-grid">
              {more.map((p) => (
                <Link key={p.slug} href={`/posts/${p.slug}/`} className="card">
                  <PostCover slug={p.slug} category={p.category} />
                  <div className="meta">
                    <span className="cat">{p.category}</span>
                    <span>{formatDate(p.date)}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.dek}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
