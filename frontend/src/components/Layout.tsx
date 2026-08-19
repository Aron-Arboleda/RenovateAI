import {Link, useLocation} from "react-router-dom";
import {useState} from "react";

export default function Layout({children}: {children: React.ReactNode}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {path: "/", label: "Home"},
    {path: "/services", label: "Services"},
    {path: "/about", label: "About"},
    {path: "/contact", label: "Contact"},
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-sora text-xl font-semibold tracking-tight text-amber-300"
          >
            RenovateAI
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${
                  isActive(link.path) ? "text-amber-300" : "text-stone-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-stone-300 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-stone-900 md:hidden">
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    isActive(link.path) ? "text-amber-300" : "text-stone-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-sora text-lg font-semibold text-amber-300">
                RenovateAI
              </p>
              <p className="mt-2 text-sm text-stone-400">
                AI-assisted lead capture and qualification for renovation
                projects.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-200">Services</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-400">
                <li>
                  <Link to="/services#kitchen" className="hover:text-amber-300">
                    Kitchen Renovation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#bathroom"
                    className="hover:text-amber-300"
                  >
                    Bathroom Remodel
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#whole-home"
                    className="hover:text-amber-300"
                  >
                    Whole-Home Renovation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#basement"
                    className="hover:text-amber-300"
                  >
                    Basement Finishing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-200">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-400">
                <li>
                  <Link to="/about" className="hover:text-amber-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-amber-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-200">
                Get Started
              </h3>
              <p className="mt-3 text-sm text-stone-400">
                Ready to transform your space? Share your project details and
                get qualified assistance.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-stone-500">
            <p>&copy; 2026 RenovateAI. Technology demonstration project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
