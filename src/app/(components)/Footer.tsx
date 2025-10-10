// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

/**
 * Footer component for the application.
 * Displays copyright information and a contact link.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-border py-4 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
          <span>© 2025 Brandon Christensen. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://brandonchristensencs.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}