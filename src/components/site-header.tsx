import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/forum", label: "Forum" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/tags", label: "Tags" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Shield Forum home">
        <ShieldCheck size={24} aria-hidden="true" />
        <span>Shield Forum</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="icon-link" href="/search" aria-label="Search">
          <Search size={18} aria-hidden="true" />
        </Link>
        <Link className="button button-small" href="/auth/sign-in">
          Sign in
        </Link>
      </div>
    </header>
  );
}
