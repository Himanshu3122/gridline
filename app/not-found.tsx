import Link from "next/link";

export default function NotFound() {
  return (
    <header className="page-head" style={{ borderBottom: 0, minHeight: "60vh" }}>
      <div className="container">
        <p className="kicker">404 · open circuit</p>
        <h1>This page isn&apos;t on the grid.</h1>
        <p style={{ marginBottom: 28 }}>The link may be broken, or the page may have moved.</p>
        <Link href="/" className="btn btn-primary">Latest stories</Link>
      </div>
    </header>
  );
}
