import Link from "next/link";
import PostCover from "@/components/PostCover";
import PostRow from "@/components/PostRow";
import { basePath, categories, categoryByName, site } from "@/lib/data";
import { formatDate, getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const others = posts.filter((p) => p !== lead);
  const top = others.slice(0, 3);

  return (
    <>
      <section className="masthead">
        <div className="container">
          <p className="kicker">
            <span className="kicker-accent">●</span>&nbsp; {site.tagline}
          </p>
        </div>
      </section>

      {lead && (
        <section className="container top-stories">
          <Link href={`/posts/${lead.slug}/`} className="card-feature lead-story reveal">
            <PostCover slug={lead.slug} category={lead.category} />
            <div className="meta">
              <span className="cat">{lead.category}</span>
              <span>{formatDate(lead.date)}</span>
              <span>{lead.readingMinutes} min read</span>
            </div>
            <h3>{lead.title}</h3>
            <p>{lead.dek}</p>
          </Link>
          <div className="post-list side-stories reveal reveal-2">
            <p className="kicker" style={{ marginBottom: 16 }}>Top stories</p>
            {top.map((p) => (
              <Link key={p.slug} href={`/posts/${p.slug}/`} className="post-row">
                <div className="meta">
                  <span className="cat">{p.category}</span>
                  <span>{formatDate(p.date)}</span>
                </div>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container river-layout">
          <div>
            <div className="section-head">
              <div>
                <p className="kicker">The latest</p>
                <h2>All stories</h2>
              </div>
            </div>
            <div className="river">
              {posts.map((p) => (
                <PostRow key={p.slug} p={p} />
              ))}
            </div>
          </div>

          <aside className="sidebar">
            <p className="kicker">Sections</p>
            <ul className="section-list">
              {categories.map((c) => {
                const n = posts.filter((p) => categoryByName(p.category)?.slug === c.slug).length;
                return (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}/`}>
                      <strong>{c.name}</strong>
                      <span className="mono muted">{n}</span>
                    </Link>
                    <p>{c.description}</p>
                  </li>
                );
              })}
            </ul>
            <a href={`${basePath}/feed.xml`} className="btn" style={{ marginTop: 24 }}>
              Subscribe via RSS
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
