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
    { path: "/landing", label: "Landing" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center group gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: '#010133' }}>
                ACTOR <span className="text-primary">Hub</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path) ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm">Connexion</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-primary via-blue-600 to-cyan-600 hover:from-primary/90 hover:via-blue-700 hover:to-cyan-700 shadow-sm">
                  Essai gratuit
                </Button>
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 px-4 pt-3 mt-2 border-t border-border">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Connexion</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary via-blue-600 to-cyan-600">Essai gratuit</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="text-white" style={{ backgroundColor: '#010133' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ACTOR Hub</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Plateforme SaaS complète de communication multi-canal pour entreprises. Centre d'appels cloud, SMS Bulk, WhatsApp Business et Email Marketing.
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
                  <div><p>+243978979898</p><p>+243822724146</p></div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <div><p>contact@biargroup.com</p></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Centre d'Appels Cloud</li>
                <li>SMS Marketing</li>
                <li>WhatsApp Business</li>
                <li>Email Marketing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Inscription</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: '#1a1a5e' }}>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Actor Hub. Tous droits réservés. &bull; Pour vous, on se dépasse.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
