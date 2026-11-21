import Link from "next/link";
import { basePath, categories, site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand" style={{ color: "var(--ink)" }}>
              <span className="brand-mark" aria-hidden />
              {site.name}
            </Link>
            <p style={{ marginTop: 14, maxWidth: 420 }}>{site.description}</p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>
              <li><Link href="/">Latest</Link></li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li><a href={`${basePath}/feed.xml`}>RSS feed</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
