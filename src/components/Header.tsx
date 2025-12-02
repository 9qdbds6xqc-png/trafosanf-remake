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
      <div className="bg-background border-b border-border/50 backdrop-blur-sm bg-background/95">
        <div className="fsm-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-foreground"
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
              <div className="text-foreground font-light text-xl tracking-tight">
                Produkt-Assistent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-background/50 border-b border-border/50 backdrop-blur-sm">
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
        <div className="md:hidden bg-background border-t border-border/50">
          <nav className="px-4 py-4 space-y-2">
            {mainNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  item.active ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-border/50 pt-4 mt-4">
              {subNav.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
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
