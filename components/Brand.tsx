import Link from "next/link";
import { site } from "@/lib/data";

// Wordmark with a lightning-bolt mark, shared by the header and footer.
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} home`}>
      <span className="brand-mark" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 2 4 14h6.5L9.5 22 20 9.5h-6.6L13.5 2Z" />
        </svg>
      </span>
      {site.name}
    </Link>
  );
}
