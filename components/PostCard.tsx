import Link from "next/link";
import PostCover from "./PostCover";
import { categoryByName } from "@/lib/data";
import { formatDate, type PostMeta } from "@/lib/posts";

// Magazine-style story card: large cover, section pill, headline, dek.
export default function PostCard({ p, compact = false }: { p: PostMeta; compact?: boolean }) {
  const cat = categoryByName(p.category);
  const href = `/posts/${p.slug}/`;
  return (
    <article className={`card${compact ? " three-col" : ""}`}>
      <Link href={href} tabIndex={-1} aria-hidden>
        <PostCover slug={p.slug} category={p.category} label={false} />
      </Link>
      <div className="card-body">
        <div className="meta">
          {cat ? (
            <Link href={`/category/${cat.slug}/`} className="pill" data-cat={cat.slug}>
              {cat.name}
            </Link>
          ) : (
            <span className="pill">{p.category}</span>
          )}
          <span>{formatDate(p.date)}</span>
          <span>{p.readingMinutes} min</span>
        </div>
        <h3>
          <Link href={href}>{p.title}</Link>
        </h3>
        {!compact && <p>{p.dek}</p>}
      </div>
    </article>
  );
}
