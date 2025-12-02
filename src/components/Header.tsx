import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const mainNav: Array<{ name: string; href: string; active?: boolean }> = [];

const subNav: Array<{ name: string; href: string }> = [];
// Upload and Backlog are password-protected, so we hide them from navigation

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Main Navigation */}
      <div className="bg-fsm-dark">
        <div className="fsm-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center space-x-0">
              {mainNav.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-6 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-white hover:text-primary"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="text-white font-bold text-2xl tracking-tight">
                Sprich mit unserem Produkt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-border">
        <div className="fsm-container">
          <nav className="hidden md:flex items-center space-x-8 py-4">
            {subNav.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              )
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-fsm-dark">
          <nav className="px-4 py-4 space-y-2">
            {mainNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  item.active ? "bg-primary text-white" : "text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-white/20 pt-4 mt-4">
              {subNav.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-white/80"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-white/80"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
