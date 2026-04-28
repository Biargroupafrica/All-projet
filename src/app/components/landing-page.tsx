import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Phone,
  MessageSquare,
  Mail,
  Send,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Users,
  Headphones,
  Star,
  Play,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Centre d'Appels Cloud",
    description:
      "Solution de centre d'appels entièrement hébergée dans le cloud. Gérez vos appels entrants et sortants, le SVI, les files d'attente et la supervision en temps réel depuis n'importe où.",
    highlights: [
      "SVI personnalisable multi-niveaux",
      "Enregistrement automatique des appels",
      "Supervision et écoute en temps réel",
      "Rapports et analyses détaillés",
      "Intégration CRM native",
    ],
    gradient: "from-primary to-orange-500",
  },
  {
    icon: MessageSquare,
    title: "SMS Bulk & Marketing",
    description:
      "Plateforme d'envoi de SMS en masse avec personnalisation avancée, programmation et suivi des performances en temps réel.",
    highlights: [
      "Envoi massif instantané",
      "Personnalisation par variable",
      "Programmation des envois",
      "Suivi de délivrabilité",
      "Gestion des contacts et listes",
    ],
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: Send,
    title: "WhatsApp Business API",
    description:
      "Intégration complète de l'API WhatsApp Business pour un service client moderne, des notifications automatisées et des campagnes marketing.",
    highlights: [
      "API WhatsApp officielle",
      "Chatbots intelligents",
      "Templates de messages",
      "Support multimédia riche",
      "Automatisation des réponses",
    ],
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description:
      "Créez et envoyez des campagnes email professionnelles avec des templates modernes, l'A/B testing et des analyses avancées.",
    highlights: [
      "Éditeur drag & drop",
      "Templates responsives",
      "A/B testing intégré",
      "Automatisation des séquences",
      "Analyses et heatmaps",
    ],
    gradient: "from-purple-500 to-purple-700",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "49",
    currency: "$",
    period: "/mois",
    description: "Idéal pour les petites entreprises",
    features: [
      "1 ligne téléphonique",
      "500 SMS/mois",
      "1 000 emails/mois",
      "Support par email",
      "Rapports basiques",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Business",
    price: "149",
    currency: "$",
    period: "/mois",
    description: "Pour les entreprises en croissance",
    features: [
      "5 lignes téléphoniques",
      "5 000 SMS/mois",
      "10 000 emails/mois",
      "WhatsApp Business",
      "Support prioritaire",
      "Rapports avancés",
      "API access",
    ],
    cta: "Commencer",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    currency: "",
    period: "",
    description: "Solutions personnalisées",
    features: [
      "Lignes illimitées",
      "SMS illimités",
      "Emails illimités",
      "Tous les canaux",
      "Support dédié 24/7",
      "SLA garanti",
      "Intégrations sur mesure",
      "Formation incluse",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-cyan-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              Plateforme de communication #1 en Afrique
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Toute votre communication{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                en une seule plateforme
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Centre d'appels cloud, SMS Bulk, WhatsApp Business et Email Marketing. Tout ce dont vous avez besoin pour communiquer efficacement avec vos clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary via-blue-600 to-cyan-600 text-white text-base px-8"
                >
                  Essai gratuit 14 jours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </div>

          {/* Feature preview cards */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Des outils puissants pour chaque canal
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez en détail chacune de nos solutions de communication.
            </p>
          </div>
          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-3 text-foreground">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <Icon className="h-24 w-24 text-white/30" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi nous choisir ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Sécurité maximale", desc: "Chiffrement de bout en bout et conformité RGPD." },
              { icon: Globe, title: "Couverture mondiale", desc: "Présent dans plus de 50 pays en Afrique et au-delà." },
              { icon: Zap, title: "Ultra performant", desc: "99.9% de disponibilité garantie avec notre infrastructure." },
              { icon: BarChart3, title: "Analyses en temps réel", desc: "Tableaux de bord et rapports pour piloter vos campagnes." },
              { icon: Users, title: "Multi-utilisateurs", desc: "Gérez les accès et permissions de toute votre équipe." },
              { icon: Headphones, title: "Support premium", desc: "Assistance technique dédiée disponible 24h/24." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 bg-card rounded-2xl border border-border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Sans engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                } bg-card`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    Populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.currency}{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary via-blue-600 to-cyan-600 text-white"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à booster votre communication ?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Commencez votre essai gratuit de 14 jours. Aucune carte de crédit requise.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 text-base px-8"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
