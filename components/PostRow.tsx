import Link from "next/link";
import PostCover from "./PostCover";
import { categoryByName } from "@/lib/data";
import { formatDate, type PostMeta } from "@/lib/posts";

// One item in the chronological "river" of stories.
export default function PostRow({ p }: { p: PostMeta }) {
  const cat = categoryByName(p.category);
  return (
    <article className="river-item">
      <div className="river-text">
        <div className="meta">
          {cat ? (
            <Link href={`/category/${cat.slug}/`} className="cat">
              {cat.name}
            </Link>
          ) : (
            <span className="cat">{p.category}</span>
          )}
          <span>{formatDate(p.date)}</span>
          <span>{p.readingMinutes} min read</span>
        </div>
        <Link href={`/posts/${p.slug}/`}>
          <h3>{p.title}</h3>
          <p>{p.dek}</p>
        </Link>
      </div>
      <Link href={`/posts/${p.slug}/`} className="river-thumb" tabIndex={-1} aria-hidden>
        <PostCover slug={p.slug} category={p.category} label={false} />
      </Link>
    </article>
  );
}
