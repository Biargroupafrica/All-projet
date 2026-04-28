import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import {
  Phone,
  MessageSquare,
  Mail,
  Send,
  Users,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Headphones,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const heroSlides = [
  {
    title: "Centre d'Appels Cloud",
    subtitle: "Gérez vos communications professionnelles depuis n'importe où avec notre solution cloud complète.",
    cta: "Découvrir",
    ctaLink: "/landing",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80",
    gradient: "from-primary/90 to-blue-600/90",
  },
  {
    title: "SMS Marketing Puissant",
    subtitle: "Envoyez des milliers de SMS en quelques clics et touchez votre audience instantanément.",
    cta: "En savoir plus",
    ctaLink: "/landing",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80",
    gradient: "from-blue-600/90 to-cyan-600/90",
  },
  {
    title: "WhatsApp Business API",
    subtitle: "Connectez-vous à vos clients sur leur plateforme préférée avec l'API WhatsApp Business.",
    cta: "Commencer",
    ctaLink: "/landing",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
    gradient: "from-green-600/90 to-emerald-600/90",
  },
  {
    title: "Email Marketing Avancé",
    subtitle: "Créez des campagnes email professionnelles avec des templates modernes et un suivi en temps réel.",
    cta: "Explorer",
    ctaLink: "/landing",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    gradient: "from-purple-600/90 to-primary/90",
  },
  {
    title: "Solution Tout-en-Un",
    subtitle: "Une seule plateforme pour gérer tous vos canaux de communication professionnels.",
    cta: "Essai gratuit",
    ctaLink: "/signup",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    gradient: "from-primary/90 to-orange-500/90",
  },
];

const stats = [
  { value: "10K+", label: "Utilisateurs actifs" },
  { value: "50M+", label: "Messages envoyés" },
  { value: "99.9%", label: "Disponibilité" },
  { value: "24/7", label: "Support client" },
];

const benefits = [
  {
    icon: Zap,
    title: "Rapide & Fiable",
    description: "Infrastructure cloud haute performance avec temps de réponse ultra-rapide.",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Chiffrement de bout en bout et conformité aux normes internationales de sécurité.",
  },
  {
    icon: Globe,
    title: "Multi-Canal",
    description: "Gérez tous vos canaux de communication depuis une seule interface unifiée.",
  },
  {
    icon: BarChart3,
    title: "Analytiques Avancées",
    description: "Tableaux de bord en temps réel et rapports détaillés pour optimiser vos campagnes.",
  },
  {
    icon: Users,
    title: "Gestion d'Équipe",
    description: "Outils collaboratifs pour gérer vos agents et suivre leurs performances.",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Une équipe dédiée disponible en permanence pour vous accompagner.",
  },
];

const solutions = [
  {
    icon: Phone,
    title: "Centre d'Appels Cloud",
    description: "Solution complète de centre d'appels avec SVI, files d'attente, enregistrement et supervision en temps réel.",
    features: ["SVI intelligent", "Enregistrement des appels", "Supervision en temps réel", "Rapports détaillés"],
    color: "from-primary to-orange-500",
    link: "/landing",
  },
  {
    icon: MessageSquare,
    title: "SMS Marketing",
    description: "Envoi de SMS en masse avec personnalisation, programmation et suivi des performances.",
    features: ["Envoi en masse", "Personnalisation", "Programmation", "Suivi en temps réel"],
    color: "from-blue-500 to-blue-700",
    link: "/landing",
  },
  {
    icon: Send,
    title: "WhatsApp Business",
    description: "Intégration WhatsApp Business API pour un service client moderne et des notifications automatisées.",
    features: ["API officielle", "Chatbots", "Notifications", "Support multimédia"],
    color: "from-green-500 to-emerald-600",
    link: "/landing",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Campagnes email professionnelles avec templates, A/B testing et analyses avancées.",
    features: ["Templates modernes", "A/B testing", "Automatisation", "Analyses détaillées"],
    color: "from-purple-500 to-purple-700",
    link: "/landing",
  },
];

const testimonials = [
  {
    name: "Marie Kabongo",
    role: "Directrice Marketing, TechAfrica",
    content: "Actor Hub a transformé notre communication client. Le centre d'appels cloud est remarquable et le support est exceptionnel.",
    rating: 5,
  },
  {
    name: "Jean-Pierre Mutombo",
    role: "CEO, Commerce Plus",
    content: "Grâce aux SMS marketing d'Actor Hub, nos campagnes atteignent un taux d'ouverture de 98%. Un outil indispensable.",
    rating: 5,
  },
  {
    name: "Sarah Ndaya",
    role: "Responsable Communication, BankFirst",
    content: "L'intégration WhatsApp Business nous a permis d'améliorer notre service client de façon spectaculaire. Très satisfaite !",
    rating: 5,
  },
];

export function VitrineHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  {slide.subtitle}
                </p>
                <Link to={slide.ctaLink}>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-3"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-primary via-blue-600 to-cyan-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi Actor Hub ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme conçue pour répondre aux besoins de communication des entreprises modernes en Afrique et dans le monde.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour chaque canal de communication.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div
                  key={index}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={solution.link}>
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-muted-foreground mb-10">
            Ils nous font confiance
          </h2>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            {["TechAfrica", "Commerce+", "BankFirst", "MobileNet", "AfriPay", "DataCorp"].map(
              (name, i) => (
                <div
                  key={i}
                  className="text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages de ceux qui utilisent Actor Hub au quotidien.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre communication ?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises qui utilisent Actor Hub pour optimiser leurs communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-base px-8"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/landing">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-base px-8"
              >
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
