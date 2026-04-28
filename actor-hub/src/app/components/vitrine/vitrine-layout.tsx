import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Menu, X, ChevronDown, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

export function VitrineLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/services", label: "Services" },
    {
      path: "/fonctionnalites",
      label: "Fonctionnalités",
      hasDropdown: true,
      submenu: [
        { path: "/fonctionnalites/call-center", label: "Centre d'Appels" },
        { path: "/fonctionnalites/sms-marketing", label: "SMS Marketing" },
        { path: "/fonctionnalites/whatsapp-business", label: "WhatsApp Business" },
        { path: "/fonctionnalites/email-marketing", label: "Email Marketing" },
      ],
    },
    { path: "/industries", label: "Industries" },
    { path: "/tarifs", label: "Tarifs" },
    { path: "/a-propos", label: "À propos" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const hasActiveSubmenu = (submenu?: Array<{ path: string; label: string }>) => {
    if (!submenu) return false;
    return submenu.some((item) => isActive(item.path));
  };

  const handleDropdownEnter = (path: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(path);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleDropdown = (path: string) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };

  const toggleMobileMenu = (path: string) => {
    setMobileExpandedMenu(mobileExpandedMenu === path ? null : path);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <span className="text-xl font-bold text-foreground">ACTOR</span>
                  <span className="text-xl font-bold text-primary"> Hub</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.path}
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter(link.path)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => toggleDropdown(link.path)}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                        isActive(link.path) || hasActiveSubmenu(link.submenu)
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openDropdown === link.path ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openDropdown === link.path && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                        {link.submenu?.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.path)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground hover:bg-muted hover:text-primary"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-border hover:border-primary hover:text-primary">
                  Connexion
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-90 shadow-sm"
                >
                  Essai gratuit
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.path}>
                      <button
                        onClick={() => toggleMobileMenu(link.path)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive(link.path) || hasActiveSubmenu(link.submenu)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${mobileExpandedMenu === link.path ? "rotate-180" : ""}`}
                        />
                      </button>

                      {mobileExpandedMenu === link.path && (
                        <div className="ml-4 mt-1 space-y-1">
                          {link.submenu?.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileExpandedMenu(null);
                              }}
                              className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                isActive(item.path)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="flex flex-col space-y-2 px-4 pt-3 mt-2 border-t border-border">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-orange-400">Essai gratuit</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-white" style={{ backgroundColor: "#010133" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">ACTOR</span>
                  <span className="text-xl font-bold text-primary"> Hub</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Plateforme SaaS complète de communication multi-canal pour entreprises. Centre d'appels cloud, SMS Bulk,
                WhatsApp Business et Email Marketing.
              </p>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 text-sm text-gray-400">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-300">Actor Hub</p>
                    <p>5 Rue Gemena, Quartier Haut commandement</p>
                    <p>Gombe, Kinshasa / RDCONGO</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p>+243978979898</p>
                    <p>+243822724146</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p>contact@biargroup.com</p>
                    <p>biar.groupafrica@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex gap-3 mt-6">
                {[
                  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2">
                {[
                  { path: "/fonctionnalites/call-center", label: "Centre d'Appels Cloud" },
                  { path: "/fonctionnalites/sms-marketing", label: "SMS Marketing" },
                  { path: "/fonctionnalites/whatsapp-business", label: "WhatsApp Business" },
                  { path: "/fonctionnalites/email-marketing", label: "Email Marketing" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                {[
                  { path: "/a-propos", label: "À propos" },
                  { path: "/tarifs", label: "Tarifs" },
                  { path: "/contact", label: "Contact" },
                  { path: "/login", label: "Commencer" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: "#1a1a5e" }}>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Actor Hub. Tous droits réservés. • Pour vous, on se dépasse.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
