import { Link } from "react-router";
import {
  MessageSquare,
  Mail,
  Phone,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  MessageCircle,
  DollarSign,
  Clock,
  Smile,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export function VitrineHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: "Plateforme Unifiée de Communication Cloud",
      intro:
        "Transformez votre communication client avec notre solution SaaS complète : Centre d'appels, SMS Bulk, WhatsApp Business et Email Marketing.",
      cta: "Essai gratuit 14 jours",
      ctaSecondary: "Voir la démo",
      link: "/login",
      linkSecondary: "/contact",
      bgColor: "from-primary via-orange-600 to-amber-600",
    },
    {
      title: "Pourquoi les Entreprises Choisissent ACTOR Hub",
      intro:
        "One platform - Infinite connections. Débloquez la croissance avec le white-label, multi-tenancy, UC tout-en-un et bien plus encore.",
      cta: "Explorer la solution",
      ctaSecondary: "Voir les tarifs",
      link: "/login",
      linkSecondary: "/tarifs",
      bgColor: "from-blue-700 via-blue-600 to-indigo-600",
    },
    {
      title: "Centre d'Appels Cloud Nouvelle Génération",
      intro:
        "Solution call center complète avec Softphone WebRTC, IVR intelligent, Power & Predictive Dialer, supervision en temps réel.",
      cta: "Découvrir le Call Center",
      ctaSecondary: "Voir les fonctionnalités",
      link: "/login",
      linkSecondary: "/fonctionnalites",
      bgColor: "from-purple-700 via-violet-600 to-indigo-600",
    },
    {
      title: "SMS Marketing Direct Opérateurs",
      intro:
        "Connexion SMPP avec 800+ opérateurs dans 190 pays. Envoyez des millions de SMS avec 99% de délivrabilité.",
      cta: "Commencer avec SMS",
      ctaSecondary: "Documentation API",
      link: "/login",
      linkSecondary: "/contact",
      bgColor: "from-green-700 via-emerald-600 to-teal-600",
    },
    {
      title: "WhatsApp Business API Officielle",
      intro:
        "Connectez-vous à 2 milliards d'utilisateurs. Chatbot IA multilingue, Broadcast illimité, Multi-agents et automation complète.",
      cta: "Activer WhatsApp",
      ctaSecondary: "Voir les cas d'usage",
      link: "/login",
      linkSecondary: "/fonctionnalites",
      bgColor: "from-green-600 via-teal-500 to-cyan-500",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const solutions = [
    {
      icon: Phone,
      title: "Centre d'Appels Cloud",
      description: "Softphone HD, IVR intelligent, supervision temps réel, dialers automatiques et CTI avancé.",
      features: ["Softphone WebRTC", "IVR Visuel", "Power/Predictive Dialer"],
      color: "from-primary to-orange-500",
      href: "/login",
    },
    {
      icon: MessageSquare,
      title: "SMS Marketing",
      description: "Connexion SMPP directe, envoi bulk illimité, SMS two-way et analytics en temps réel.",
      features: ["SMPP Direct", "SMS Bulk", "Two-Way Conversations"],
      color: "from-blue-500 to-cyan-500",
      href: "/login",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Business",
      description: "API officielle, chatbot IA, broadcast illimité, chat multi-agents et automation complète.",
      features: ["Chatbot IA", "Broadcast", "Multi-Agents"],
      color: "from-green-500 to-emerald-500",
      href: "/login",
    },
    {
      icon: Mail,
      title: "Email Marketing",
      description: "Éditeur drag & drop, automation workflows, segmentation avancée et délivrabilité optimisée.",
      features: ["Drag & Drop", "Automation", "99.5% Délivrabilité"],
      color: "from-purple-600 to-pink-600",
      href: "/login",
    },
  ];

  const benefits = [
    { icon: TrendingUp, value: "98%", title: "Taux d'engagement client", description: "Augmentation moyenne de l'engagement", color: "text-primary" },
    { icon: DollarSign, value: "60%", title: "Réduction des coûts", description: "Économies sur vos communications", color: "text-blue-600" },
    { icon: Smile, value: "95%", title: "Satisfaction client", description: "Amélioration de la satisfaction", color: "text-green-600" },
    { icon: Clock, value: "75%", title: "Gain de temps", description: "Automatisation de vos processus", color: "text-orange-600" },
    { icon: BarChart3, value: "4.2x", title: "ROI mesurable", description: "Retour sur investissement moyen", color: "text-indigo-600" },
    { icon: Settings, value: "24h", title: "Intégration rapide", description: "Avec vos outils existants", color: "text-teal-600" },
  ];

  const stats = [
    { value: "5,000+", label: "Entreprises clientes" },
    { value: "190+", label: "Pays couverts" },
    { value: "99.9%", label: "Uptime garanti" },
    { value: "24/7", label: "Support expert" },
  ];

  const testimonials = [
    {
      name: "Amadou Diallo",
      role: "CEO, TechAfrique SARL",
      country: "Cameroun",
      quote: "Actor Hub a transformé notre communication client. Nous envoyons 500K SMS/mois avec un taux de délivrabilité de 99%. Un ROI exceptionnel !",
      rating: 5,
      initials: "AD",
      bg: "from-primary to-orange-500",
    },
    {
      name: "Li Wei Zhang",
      role: "Marketing Director, AsiaConnect",
      country: "Singapour",
      quote: "L'intégration WhatsApp Business avec leur chatbot IA a augmenté notre engagement de 300%. Support client exceptionnel.",
      rating: 5,
      initials: "LZ",
      bg: "from-blue-600 to-indigo-600",
    },
    {
      name: "Sarah Miller",
      role: "COO, EuroRetail Group",
      country: "France",
      quote: "La plateforme la plus complète du marché. Call center, SMS, WhatsApp et Email dans une seule interface. Excellent rapport qualité/prix.",
      rating: 5,
      initials: "SM",
      bg: "from-purple-600 to-pink-600",
    },
  ];

  const clientLogos = ["MTN", "Orange", "Moov", "Airtel", "Vodafone", "Camtel", "Total", "BICEC", "Afriland", "Ecobank", "UBA", "SCB"];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Banner Slider */}
      <section className="relative h-[550px] md:h-[650px] overflow-hidden">
        {bannerSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br ${slide.bgColor} ${
              currentSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="text-white max-w-3xl">
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${
                    currentSlide === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl transition-all duration-700 delay-200 ${
                    currentSlide === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.intro}
                </p>
                <div
                  className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                    currentSlide === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <Link
                    to={slide.link}
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {slide.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to={slide.linkSecondary}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold transition-all border border-white/20"
                  >
                    {slide.ctaSecondary}
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating cards décoratives */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
              {[
                { icon: Phone, label: "Appels actifs", value: "1,247" },
                { icon: MessageSquare, label: "SMS envoyés", value: "98.5%" },
                { icon: MessageCircle, label: "WhatsApp", value: "2M+" },
              ].map(({ icon: Icon, label, value }, i) => (
                <div
                  key={i}
                  className={`bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3 transition-all duration-700 ${
                    currentSlide === idx
                      ? `opacity-100 translate-x-0 delay-[${400 + i * 100}ms]`
                      : "opacity-0 translate-x-8"
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">{label}</p>
                    <p className="text-white font-bold text-lg">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "bg-white w-12" : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ACTOR Hub */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Pourquoi Actor Hub ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Des fonctionnalités puissantes pour propulser votre entreprise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <div className={`text-4xl font-bold mb-2 ${benefit.color}`}>{benefit.value}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Rejoignez des milliers d'entreprises</h3>
            <p className="text-xl opacity-90 mb-6">qui ont transformé leur communication avec nos solutions</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {["Intégration en 24h", "Sans engagement", "Support francophone"].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Nos Solutions Multi-Canal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Une plateforme unifiée pour gérer tous vos canaux de communication professionnels
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, idx) => (
              <Link
                key={idx}
                to={solution.href}
                className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{solution.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {solution.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-primary font-semibold gap-1 group-hover:gap-2 transition-all">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Logos */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Ils Nous Font Confiance</h2>
            <p className="text-gray-600 dark:text-gray-400">Des entreprises leaders dans leur secteur</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {clientLogos.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-400 font-semibold">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Des milliers d'entreprises dans le monde utilisent Actor Hub chaque jour
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.bg} flex items-center justify-center text-white font-bold text-xl`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">{testimonial.country}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-orange-400 p-12 rounded-3xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Prêt à Transformer Votre Communication ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Démarrez gratuitement dès aujourd'hui. Aucune carte bancaire requise. Support francophone 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-flex items-center justify-center"
              >
                Planifier une démo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              {["Essai gratuit 14 jours", "Sans engagement", "Support 24/7"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
