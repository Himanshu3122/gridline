import Link from "next/link";
import PostCard from "@/components/PostCard";
import PostCover from "@/components/PostCover";
import { basePath, categories, categoryByName, site } from "@/lib/data";
import { formatDate, getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const others = posts.filter((p) => p !== lead);
  const leadCat = lead ? categoryByName(lead.category) : undefined;

  // Highlight the last three words of the tagline ("the power grid").
  const words = site.tagline.split(" ");
  const cut = Math.max(0, words.length - 3);
  const taglineHead = words.slice(0, cut).join(" ");
  const taglineTail = words.slice(cut).join(" ");

  return (
    <>
      <section className="hero night">
        <div className="container">
          <div className="reveal">
            <p className="kicker">
              <span className="kicker-dot" />
              {posts.length} stories · {categories.length} sections
            </p>
            <h1 className="hero-title">
              {taglineHead} <span className="hl">{taglineTail}</span>.
            </h1>
            <p className="hero-sub">{site.description}</p>
            <div className="hero-actions">
              <a href="#latest" className="btn btn-volt">
                Read the latest
              </a>
              <a href={`${basePath}/feed.xml`} className="btn btn-ghost">
                Subscribe via RSS
              </a>
            </div>
          </div>

          {lead && (
            <Link href={`/posts/${lead.slug}/`} className="feature reveal reveal-2">
              <PostCover slug={lead.slug} category={lead.category} />
              <div className="feature-body">
                <div className="meta">
                  <span className="pill" data-cat={leadCat?.slug}>
                    Featured · {lead.category}
                  </span>
                  <span>{formatDate(lead.date)}</span>
                  <span>{lead.readingMinutes} min read</span>
                </div>
                <h2>{lead.title}</h2>
                <p>{lead.dek}</p>
                <span className="read-link">Read the story →</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" id="latest">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">The latest</p>
                <h2>Fresh off the wire</h2>
              </div>
            </div>
            <div className="card-grid">
              {others.map((p) => (
                <PostCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Sections</p>
              <h2>Browse by topic</h2>
            </div>
          </div>
          <div className="topic-grid">
            {categories.map((c) => {
              const n = posts.filter((p) => categoryByName(p.category)?.slug === c.slug).length;
              return (
                <Link key={c.slug} href={`/category/${c.slug}/`} className="topic-tile" data-cat={c.slug}>
                  <div className="topic-top">
                    <span>
                      {n} {n === 1 ? "story" : "stories"}
                    </span>
                    <span className="topic-arrow" aria-hidden>
                      →
                    </span>
                  </div>
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container cta-wrap">
        <div className="cta">
          <div>
            <h2>Never miss a story.</h2>
            <p>New posts land in your feed reader the day they are published. No account, no email list.</p>
          </div>
          <a href={`${basePath}/feed.xml`} className="btn">
            Subscribe via RSS
          </a>
        </div>
      </section>
    </>
  );
}
