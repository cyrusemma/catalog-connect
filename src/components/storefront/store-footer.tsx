import { Link } from "@tanstack/react-router";

export function StoreFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 px-6 py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>© {new Date().getFullYear()} Catalog. All rights reserved.</p>
        <Link to="/admin/login" className="opacity-60 hover:opacity-100">
          Admin
        </Link>
      </div>
    </footer>
  );
}
