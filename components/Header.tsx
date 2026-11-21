"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { basePath, categories, site } from "@/lib/data";

function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme;
    setDark(explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme">
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label={`${site.name} home`}>
            <span className="brand-mark" aria-hidden />
            {site.name}
          </Link>
          <nav className="nav" aria-label="Categories">
            {categories.map((c) => {
              const href = `/category/${c.slug}/`;
              return (
                <Link key={c.slug} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
                  {c.name}
                </Link>
              );
            })}
          </nav>
          <div className="header-actions">
            <a href={`${basePath}/feed.xml`} className="icon-btn" aria-label="RSS feed" title="RSS feed">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
                <circle cx="6" cy="18" r="1.4" fill="currentColor" />
              </svg>
            </a>
            <ThemeToggle />
            <button className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <nav className="mobile-nav" aria-label="Mobile">
            <Link href="/">Latest</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}/`}>
                {c.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
